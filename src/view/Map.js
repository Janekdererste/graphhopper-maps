import React from "react";

//import leafletCss from "!raw-loader!leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
import styles from "./Map.css";

export default ({ paths }) => {
  return <LeafletComponent paths={paths} />;
};

class LeafletComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPathIndex: -1
    };
  }

  componentDidMount() {
    console.log("did mount");
    this.forceUpdate();

    let leaflet = new Leaflet.map(this.leafletRoot);
    this.leafletRoot.addEventListener("resize", e => {
      leaflet.invalidateSize();
    });

    leaflet.on("load", e => {
      this.forceUpdate();
    });
    leaflet.setView([52.517709, 13.410312], 13);
    Leaflet.tileLayer(
      "http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
      }
    ).addTo(leaflet);
    this.leaflet = leaflet;
    //This is probably a nasty hack and should be done differently in the distant future
    this.forceRerenderAfterTimeout(leaflet);
  }

  componentWillReceiveProps(nextProps) {
    //needs to determine whether props have changed
    if (nextProps.paths && nextProps.paths.length > 0) {
      let firstPath = nextProps.paths[0];
      let geoJson = this._transformLegsToGeoJson(firstPath.legs);
      Leaflet.geoJson(geoJson, {
        style: feature => this._getStyle(feature)
      }).addTo(this.leaflet);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate() {
    console.log("update");
  }

  render() {
    console.log("render: " + this.props.someProp);
    if (this.leafletRoot) console.log(this.leafletRoot.clientHeight);
    return (
      <div className={styles.fill}>
        {this.props.someProp}
        <div
          style={{ height: "100%" }}
          ref={div => {
            this.leafletRoot = div;
          }}
        />
      </div>
    );
  }

  forceRerenderAfterTimeout(leaflet) {
    setTimeout(() => {
      leaflet.invalidateSize();
    }, 100);
  }

  _transformLegsToGeoJson(legs) {
    const features = legs.map(leg => {
      return {
        type: "Feature",
        properties: {
          type: leg.type
        },
        geometry: leg.geometry
      };
    });
    let featureCollection = {
      type: "FeatureCollection",
      features: features
    };
    return featureCollection;
  }

  _getStyle(feature) {
    let style = {
      weight: 5
    };
    switch (feature.properties.type) {
      case "walk":
        style.color = "#db4343";
        break;
      case "pt":
        style.color = "#42a7f4";
        break;
      default:
        style.color = "#71db43";
    }
    return style;
  }
}
