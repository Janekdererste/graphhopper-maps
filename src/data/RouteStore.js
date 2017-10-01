import DataManager, { DataManagerActionType } from "./DataManager.js";
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
        DataManager.queryRoute(this.createQuery());
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

  _updateSearch(state, property, value) {
    let newState = Object.assign({}, state);
    newState.searchState[property] = value;
    return newState;
  }

  createQuery() {
    const search = this.searchStore.getState();
    return (
      "/route?point=" +
      search.from[0] +
      "," +
      search.from[1] +
      "&point=" +
      search.to +
      "&locale=en-US&vehicle=pt&weighting=" +
      search.weighting +
      "&elevation=false&pt.earliest_departure_time=" +
      search.departureTime +
      "&use_miles=false&points_encoded=false&pt.max_walk_distance_per_leg=" +
      search.maxWalkDistance +
      "&pt.profile=true&pt.limit_solutions=" +
      search.limitSolutions
    );
  }

  parseResult(text, callback, error) {
    let result = JSON.parse(text);
    return result.paths;
  }

  createTimeParameter(search) {
    let query = "&pt.";
    if (search.timeOption == TimeOption.NOW) {
      query = +"arrive_by=" + new Date(Date.now()).toISOString();
    } else if (search.timeOption == TimeOption.DEPARTURE) {
      query += "earliest_departure_time=" + search.time;
    } else {
      query = +"earliest_departure_time=" + new Date(Date.now()).toISOString();
    }
  }
}

export const RouteActionType = {
  REQUEST_PATH: "RouteActionType_REQUEST_PATH",
  RECEIVE_PATH: "RouteActionType_RECEIVE_PATH"
};
