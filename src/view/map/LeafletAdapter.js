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
      "http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",
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
      marker.remove();
    });
    this._markers = [];

    locations.forEach(location => {
      let marker = Leaflet.marker(location.coords, { draggable: true });
      marker.on("dragend", e => {
        Dispatcher.dispatch({
          type: location.actionType,
          value: [e.target._latlng.lat, e.target._latlng.lng]
        });
      });
      marker.addTo(this.map);
      this._markers.push(marker);
    });
  }

  setNewPaths(paths, selectedRouteIndex) {
    let featureCollections = paths.map((path, i) =>
      this._legsToFeatureCollection(path.legs, i)
    );
    this.unselectedLayer.clearLayers();
    this.selectedLayer.clearLayers();

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

  _legsToFeatureCollection(legs, pathIndex) {
    const features = [];
    legs.forEach(leg => {
      features.push(this._createFeatureFromGeometry(leg.type, leg.geometry));
      if (leg.type === "pt") {
        features.push(
          this._createFeatureFromGeometry(leg.type, leg.stops[0].geometry)
        );
        features.push(
          this._createFeatureFromGeometry(
            leg.type,
            leg.stops[leg.stops.length - 1].geometry
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
