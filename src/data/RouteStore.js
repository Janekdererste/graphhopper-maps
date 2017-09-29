import DataManager, { DataManagerActionType } from "./DataManager.js";
import Store from "./Store.js";
import { SearchActionType } from "./SearchStore.js";

export default class RouteStore extends Store {
  constructor(dispatcher, searchState) {
    super(dispatcher);
    this._state.searchState = searchState;
  }

  getInitialState() {
    return {
      isFetching: false,
      isLastQuerySuccess: true
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case RouteActionType.REQUEST_PATH:
        DataManager.queryRoute(this.createQuery());
        return Object.assign({}, state, { isFetching: true });
      case RouteActionType.RECEIVE_PATH:
        return Object.assign({}, state, {
          isFetching: false,
          paths: action.value
        });
      case SearchActionType.FROM:
        return this._updateSearch(state, "from", action.value);
      case SearchActionType.TO:
        return this._updateSearch(state, "to", action.value);
      case SearchActionType.WEIGHTING:
        return this._updateSearch(state, "weighting", action.value);
      case SearchActionType.DEPARTURE_TIME:
        return this._updateSearch(state, "departureTime", action.value);
      case SearchActionType.MAX_WALK_DISTANCE:
        return this._updateSearch(state, "maxWalkDistance", action.value);
      case SearchActionType.LIMIT_SOLUTIONS:
        return this._updateSearch(state, "limitSolutions", action.value);
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

  _updateSearch(state, property, value) {
    let newState = Object.assign({}, state);
    newState.searchState[property] = value;
    return newState;
  }

  createQuery() {
    const state = this.getState();
    return (
      "/route?point=" +
      state.searchState.from[0] +
      "," +
      state.searchState.from[1] +
      "&point=" +
      state.searchState.to +
      "&locale=en-US&vehicle=pt&weighting=" +
      state.searchState.weighting +
      "&elevation=false&pt.earliest_departure_time=" +
      state.searchState.departureTime +
      "&use_miles=false&points_encoded=false&pt.max_walk_distance_per_leg=" +
      state.searchState.maxWalinkDistance +
      "&pt.profile=true&pt.limit_solutions=" +
      state.searchState.limitSolutions
    );
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
