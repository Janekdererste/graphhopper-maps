import DataManager, { DataManagerActionType } from "./DataManager.js";
import { CreateQuery } from "./Query.js";
import RealtimePath from "./RealtimePath.js";
import Store from "./Store.js";
import SearchStore, { TimeOption, SearchActionType } from "./SearchStore.js";

export default class RouteStore extends Store {
  constructor(dispatcher, searchStore) {
    super(dispatcher);
    this.searchStore = searchStore;
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
      case SearchActionType.FROM:
      case SearchActionType.TO:
      case SearchActionType.WEIGHTING:
      case SearchActionType.DEPARTURE_TIME:
      case SearchActionType.DEPARTURE_DATE:
      case SearchActionType.MAX_WALK_DISTANCE:
      case SearchActionType.LIMIT_SOLUTIONS:
      case SearchActionType.TIME_OPTION:
      case RouteActionType.REQUEST_PATH:
        return this._requestPath(state);
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

  _requestPath(state) {
    DataManager.queryRoute(CreateQuery(this.searchStore.getState()));
    return Object.assign({}, state, {
      isFetching: DataManager.isFetching(),
      selectedRouteIndex: 0
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
    let paths = result.paths.map(path => RealtimePath.createFromAPIPath(path));
    paths[this.getState().selectedRouteIndex].isSelected = true;
    return paths;
  }
}

export const RouteActionType = {
  REQUEST_PATH: "RouteActionType_REQUEST_PATH",
  RECEIVE_PATH: "RouteActionType_RECEIVE_PATH",
  SELECTED_ROUTE_INDEX: "RouteActionType_SELECTED_ROUTE_INDEX"
};
