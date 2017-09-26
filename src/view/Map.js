import React from "react";

//import leafletCss from "!raw-loader!leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
import styles from "./Map.css";

export default () => {
  return <LeafletComponent />;
};

class LeafletComponent extends React.Component {
  constructor(props) {
    super(props);
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

  compnentDidUpdate() {
    console.log("update");
  }

  render() {
    console.log("render");
    if (this.leafletRoot) console.log(this.leafletRoot.clientHeight);
    return (
      <div className={styles.fill}>
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
}
