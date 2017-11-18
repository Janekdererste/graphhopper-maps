import Store from "./Store.js";
import DataManager, { DataManagerActionType } from "./DataManager.js";

export default class InfoStore extends Store {
  getInitialState() {
    //start a request for endpoint information
    DataManager.queryEndpointInfo("/info");

    return {
      boundingBox: [],
      supportedVehicles: []
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case DataManagerActionType.RECEIVED_INFO:
        return this._reduceReceivedInfo(state, action.value);
      default:
        return state;
    }
  }

  _reduceReceivedInfo(state, responseText) {
    let response = JSON.parse(responseText);
    return Object.assign({}, state, {
      boundingBox: response.bbox,
      supportedVehicles: response.supported_vehicles
    });
  }
}
