import React from "react";
import LeafletAdapter from "./LeafletAdapter.js";
import styles from "./Map.css";
import { SearchActionType } from "../../data/SearchStore.js";
import fromIcon from "./circle.png";

export default ({ routes, search }) => {
  return <LeafletComponent routes={routes} search={search} />;
};

class LeafletComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.leaflet = new LeafletAdapter(this.leafletRoot);

    //This is probably a nasty hack and should be done differently in the distant future
    this._forceRerenderAfterTimeout(50);
  }

  componentWillReceiveProps({ routes, search }) {
    if (routes && routes.paths && routes.paths.length > 0) {
      this.leaflet.setNewPaths(routes.paths, routes.selectedRouteIndex);
      this.leaflet.setMarkers([
        {
          actionType: SearchActionType.FROM,
          coords: search.from,
          icon: fromIcon
        },
        {
          actionType: SearchActionType.TO,
          coords: search.to
        }
      ]);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
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

  _forceRerenderAfterTimeout(timeout) {
    setTimeout(() => {
      if (this.leafletRoot.clientHeight > 0) {
        this.leaflet.invalidateSize();
      } else {
        console.log(timeout);
        this._forceRerenderAfterTimeout(timeout * 2);
      }
    }, timeout);
  }

  _adjustBoundingBox() {
    this.leaflet.fitBounds(this.selectedLayer.getBounds());
  }
}
