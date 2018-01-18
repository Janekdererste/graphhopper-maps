import Leaflet, { latLng } from "leaflet";
import Dispatcher from "../../data/Dispatcher.js";
import circleIcon from "./circle.png";
import { WaypointType } from "../../data/Waypoint";

export default class LeafletAdapter {
  constructor(mapDOMElement) {
    this.map = Leaflet.map(mapDOMElement);
    this.map.zoomControl.setPosition("topright");
    this._markers = [];
    this._initializeMap();
  }

  _initializeMap() {
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
    this.unselectedLayer = this._createGeoJsonLayer(
      f => this._getUnselectedStyle(f),
      (f, latLng) => null
    );

    this.selectedLayer = this._createGeoJsonLayer(
      f => this._getSelectedStyle(f),
      (f, latLng) =>
        this._getCircleMarker({
          latLng: latLng,
          undefined,
          iconUrl: circleIcon,
          iconSize: 10
        })
    );
  }

  _createGeoJsonLayer(style, marker) {
    return Leaflet.geoJSON(undefined, {
      style: style,
      pointToLayer: marker
    }).addTo(this.map);
  }

  invalidateSize() {
    this.map.invalidateSize();
  }

  setBoundingBox(left, bottom, right, top) {
    let corner1 = Leaflet.latLng(bottom, left);
    let corner2 = Leaflet.latLng(top, right);
    let bounds = Leaflet.latLngBounds(corner1, corner2);
    this.map.fitBounds(bounds);
  }

  setMarkers(locations) {
    this._markers.forEach(marker => {
      marker.off();
      marker.remove();
    });
    this._markers = [];

    locations.forEach(location => {
      const props = {
        latLng: location.coords,
        iconUrl: location.icon,
        iconSize: 20,
        onDragEnd: latLng =>
          Dispatcher.dispatch({
            type: location.actionType,
            value: [latLng.lat, latLng.lng]
          })
      };
      let marker = this._getCircleMarker(props);
      marker.addTo(this.map);
      this._markers.push(marker);
    });
    const group = Leaflet.featureGroup(this._markers);
  }

  _getCircleMarker({ latLng, onDragEnd, iconUrl, iconSize }) {
    let marker = Leaflet.marker(latLng, { draggable: false });
    if (onDragEnd) {
      marker.options.draggable = true;
      marker.on("dragend", e => onDragEnd(e.target._latlng));
    }

    if (iconUrl) {
      let icon = Leaflet.icon({
        iconUrl: iconUrl,
        iconAnchor: [iconSize / 2, iconSize / 2],
        iconSize: [iconSize, iconSize]
      });
      marker.setIcon(icon);
    }
    return marker;
  }

  setNewPaths(paths, selectedRouteIndex) {
    this.clearPaths();

    let featureCollections = paths.map(path =>
      this._createFeatureCollection(path)
    );

    featureCollections.forEach((collection, i) => {
      if (i === selectedRouteIndex) {
        this.selectedLayer.addData(collection);
      } else {
        this.unselectedLayer.addData(collection);
      }
    });
    this.selectedLayer.bringToFront();
  }

  clearPaths() {
    this.unselectedLayer.clearLayers();
    this.selectedLayer.clearLayers();
  }

  _createFeatureCollection(path) {
    const features = [];
    path.legs.forEach(leg => {
      let feature = this._createFeatureFromGeometry(leg.type, leg.geometry);
      features.push(feature);
    });
    path.waypoints.forEach(waypoint => {
      if (waypoint.type === WaypointType.INBEETWEEN) {
        let feature = this._createFeatureFromGeometry(
          "waypoint",
          waypoint.geometry
        );
        features.push(feature);
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
      case "pt":
        style.color = "#015eaf";
        break;
      default:
        style.color = "#87edff";
    }
    style.fillColor = style.color;
    return style;
  }

  _getUnselectedStyle(feature) {
    return {
      weight: 4,
      color: "#858687"
    };
  }
}
