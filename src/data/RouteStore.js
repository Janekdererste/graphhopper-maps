import DataManager, { DataManagerActionType } from "./DataManager.js";
import { CreateQuery } from "./Query.js";
import Path from "./Path.js";
import Store from "./Store.js";

export default class RouteStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
  }

  getInitialState() {
    return {
      isFetching: false,
      isLastQuerySuccess: true,
      selectedRouteIndex: 0
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case RouteActionType.RECEIVE_PATH:
        return Object.assign({}, state, {
          isFetching: false,
          paths: action.value
        });
      case RouteActionType.SELECTED_ROUTE_INDEX:
        return this._selectRoute(state, action.value);
      case DataManagerActionType.QUERY_DATA:
        return Object.assign({}, state, {
          isFetching: DataManager.isFetching(),
          selectedRouteIndex: 0
        });
      case DataManagerActionType.RECEIVED_ROUTE:
        return this._handleReceivedRoute(state, action);
      case DataManagerActionType.ROUTE_QUERY_ERROR:
        return this._handleReceivedError(state);
      default:
        return state;
    }
  }

  _selectRoute(oldState, newSelectedRouteIndex) {
    const oldSelectedPathIndex = oldState.selectedRouteIndex;
    oldState.paths[oldSelectedPathIndex].isSelected = false;
    oldState.paths[newSelectedRouteIndex].isSelected = true;
    return Object.assign({}, oldState, {
      selectedRouteIndex: newSelectedRouteIndex
    });
  }

  _handleReceivedRoute(state, action) {
    const paths = this._parseResult(action.value);
    return Object.assign({}, state, {
      paths: paths,
      isLastQuerySuccess: true,
      isFetching: DataManager.isFetching()
    });
  }

  _handleReceivedError(state) {
    return Object.assign({}, state, {
      isFetching: DataManager.isFetching(),
      isLastQuerySuccess: false
    });
  }

  _parseResult(text) {
    let result = JSON.parse(text);
    console.log(result);
    return this._createPaths(result);
  }

  _createPaths(result) {
    let paths = result.paths.map(path => new Path(path));
    paths[this.getState().selectedRouteIndex].isSelected = true;
    return paths;
  }
}

export const RouteActionType = {
  REQUEST_PATH: "RouteActionType_REQUEST_PATH",
  RECEIVE_PATH: "RouteActionType_RECEIVE_PATH",
  SELECTED_ROUTE_INDEX: "RouteActionType_SELECTED_ROUTE_INDEX"
};
