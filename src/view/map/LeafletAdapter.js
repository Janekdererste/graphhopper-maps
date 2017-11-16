import Leaflet from "leaflet";
import Dispatcher from "../../data/Dispatcher.js";

export default class LeafletAdapter {
  constructor(mapDOMElement) {
    this.map = Leaflet.map(mapDOMElement);
    this._markers = [];
    this._initializeMap();
  }

  _initializeMap() {
    this.map.setView([52.517709, 13.410312], 13);
    this._initializeTileLayer();
    this._initializeRouteLayer();
  }

  _initializeTileLayer() {
    Leaflet.tileLayer(
      "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=2ff19cdf28f249e2ba8e14bc6c083b39",
      {
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
      }
    ).addTo(this.map);
  }

  _initializeRouteLayer() {
    this.unselectedLayer = this._createGeoJsonLayer(f =>
      this._getUnselectedStyle(f)
    );
    this.selectedLayer = this._createGeoJsonLayer(f =>
      this._getSelectedStyle(f)
    );
  }

  _createGeoJsonLayer(style) {
    return Leaflet.geoJSON(undefined, {
      style: style,
      pointToLayer: (f, latLng) => Leaflet.circleMarker(latLng, { fill: true })
    }).addTo(this.map);
  }

  invalidateSize() {
    this.map.invalidateSize();
  }

  setMarkers(locations) {
    this._markers.forEach(marker => {
      marker.off();
      marker.remove();
    });
    this._markers = [];

    locations.forEach(location => {
      let marker = Leaflet.marker(location.coords, {
        draggable: true
      });
      marker.on("dragend", e => {
        Dispatcher.dispatch({
          type: location.actionType,
          value: [e.target._latlng.lat, e.target._latlng.lng]
        });
      });

      if (location.icon) {
        let icon = Leaflet.icon({
          iconUrl: location.icon,
          iconAnchor: [10, 10],
          iconSize: [20, 20]
        });
        marker.setIcon(icon);
      }
      marker.addTo(this.map);
      this._markers.push(marker);
    });
    const group = Leaflet.featureGroup(this._markers);
    this.map.fitBounds(group.getBounds().pad(0.1));
  }

  setNewPaths(paths, selectedRouteIndex) {
    this.clearPaths();

    let featureCollections = paths.map((path, i) =>
      this._legsToFeatureCollection(path.legs, i)
    );
    featureCollections.forEach((collection, i) => {
      if (i === selectedRouteIndex) {
        this.selectedLayer.addData(collection);
      } else {
        this.unselectedLayer.addData(collection);
      }
    });
    this.selectedLayer.bringToFront();
    this.map.fitBounds(this.selectedLayer.getBounds());
  }

  clearPaths() {
    this.unselectedLayer.clearLayers();
    this.selectedLayer.clearLayers();
  }

  _legsToFeatureCollection(legs, pathIndex) {
    const features = [];
    legs.forEach(leg => {
      features.push(this._createFeatureFromGeometry(leg.type, leg.geometry));
      if (leg.type === "pt") {
        features.push(
          this._createFeatureFromGeometry(leg.type, leg.legDetails[0].geometry)
        );
        features.push(
          this._createFeatureFromGeometry(
            leg.type,
            leg.legDetails[leg.legDetails.length - 1].geometry
          )
        );
      }
    });
    return {
      type: "FeatureCollection",
      features: features
    };
  }

  _createFeatureFromGeometry(type, geometry) {
    return {
      type: "Feature",
      properties: {
        type: type
      },
      geometry: geometry
    };
  }

  _getSelectedStyle(feature) {
    let style = this._getUnselectedStyle(feature);
    switch (feature.properties.type) {
      case "walk":
        style.color = "#87edff";
        break;
      case "pt":
        style.color = "#1eddff";
        break;
      default:
        style.color = "#87edff";
    }
    style.fillColor = style.color;
    return style;
  }

  _getUnselectedStyle(feature) {
    return {
      weight: 5,
      color: "#858687",
      fillOpacity: 1,
      radius: 7
    };
  }
}
