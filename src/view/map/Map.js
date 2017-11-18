import React from "react";
import LeafletAdapter from "./LeafletAdapter.js";
import Http from "../../data/Http.js";
import styles from "./Map.css";
import { SearchActionType } from "../../data/SearchStore.js";
import InfoStore from "../../data/InfoStore.js";
import Dispatcher from "../../data/Dispatcher.js";
import fromIcon from "./circle.png";

export default ({ routes, search }) => {
  return <LeafletComponent routes={routes} search={search} />;
};

class LeafletComponent extends React.Component {
  constructor(props) {
    super(props);
    this.infoStore = new InfoStore(Dispatcher);
    this.infoStore.registerChangeHandler(() => this._handleInfoStoreChanged());
  }

  componentDidMount() {
    this.leaflet = new LeafletAdapter(this.leafletRoot);

    //This is probably a nasty hack and should be done differently in the distant future
    this._forceRerenderAfterTimeout(50);
    if (this.infoStore.getState().boundingBox.length > 0) {
      this.leaflet.setBoundingBox(this.infoStore.getState().boundingBox);
    }
  }

  componentWillReceiveProps({ routes, search }) {
    if (routes.isFetching || !routes.isLastQuerySuccess) {
      this.leaflet.clearPaths();
    } else if (routes.paths && routes.paths.length > 0) {
      this.leaflet.setNewPaths(routes.paths, routes.selectedRouteIndex);
      this.leaflet.setMarkers([
        {
          actionType: SearchActionType.FROM,
          coords: search.from.toArray(),
          icon: fromIcon
        },
        {
          actionType: SearchActionType.TO,
          coords: search.to.toArray()
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

  _handleInfoStoreChanged() {
    let ghBoundingBox = this.infoStore.getState().boundingBox;
    if (ghBoundingBox.length == 4) {
      this.leaflet.setBoundingBox(
        ghBoundingBox[0],
        ghBoundingBox[1],
        ghBoundingBox[2],
        ghBoundingBox[3]
      );
    } else {
      console.error(
        "Bounding box received from server didn't have the correct format."
      );
    }
  }
}
