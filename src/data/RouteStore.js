import DataManager, { DataManagerActionType } from "./DataManager.js";
import Query from "./Query.js";
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
      isLastQuerySuccess: true
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case RouteActionType.RECEIVE_PATH:
        return Object.assign({}, state, {
          isFetching: false,
          paths: action.value
        });
      case SearchActionType.FROM:
      case SearchActionType.TO:
      case SearchActionType.WEIGHTING:
      case SearchActionType.DEPARTURE_TIME:
      case SearchActionType.MAX_WALK_DISTANCE:
      case SearchActionType.LIMIT_SOLUTIONS:
      case SearchActionType.TIME_OPTION:
      case RouteActionType.REQUEST_PATH:
        DataManager.queryRoute(new Query(this.searchStore.getState()));
        return Object.assign({}, state, { isFetching: true });
      case DataManagerActionType.RECEIVED_ROUTE:
        const paths = this.parseResult(action.value);
        return Object.assign({}, state, {
          paths: paths,
          isLastQuerySuccess: true,
          isFetching: false
        });
      case DataManagerActionType.ROUTE_QUERY_ERROR:
        return Object.assign({}, state, {
          isFetching: false,
          isLastQuerySuccess: false
        });
      default:
        return state;
    }
  }

  parseResult(text, callback, error) {
    let result = JSON.parse(text);
    return result.paths;
  }
}

export const RouteActionType = {
  REQUEST_PATH: "RouteActionType_REQUEST_PATH",
  RECEIVE_PATH: "RouteActionType_RECEIVE_PATH"
};
