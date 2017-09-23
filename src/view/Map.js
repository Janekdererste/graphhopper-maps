import React from "react";
import Leaflet from "leaflet";
import leafletCss from "!raw-loader!leaflet/dist/leaflet.css";
import styles from "./Map.css";

export default () => {
  return <LeafletComponent />;
};

class LeafletComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.leaflet = new Leaflet.map(this.leafletRoot, {
      center: [52.517709, 13.410312],
      zoom: 10
    });
    Leaflet.tileLayer(
      "http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
      }
    ).addTo(this.leaflet);
  }

  render() {
    return (
      <div className={styles.fill}>
        <style dangerouslySetInnerHTML={{ __html: leafletCss }} />
        <div
          style={{ height: "1000px" }}
          ref={div => {
            this.leafletRoot = div;
          }}
        />
      </div>
    );
  }
}
