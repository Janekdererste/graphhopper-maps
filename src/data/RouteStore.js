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
        DataManager.queryRoute(new Query(this.searchStore.getState()));
        return Object.assign({}, state, {
          isFetching: true,
          selectedRouteIndex: 0
        });
      case DataManagerActionType.RECEIVED_ROUTE:
        const paths = this.parseResult(action.value);
        console.log(paths);
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

  _selectRoute(oldState, newSelectedRouteIndex) {
    const oldSelectedPathIndex = oldState.selectedRouteIndex;
    const state = Object.assign({}, oldState, {
      selectedRouteIndex: newSelectedRouteIndex
    });

    const formerSelectedPath = state.paths[oldSelectedPathIndex];
    const unselectedPath = Object.assign({}, formerSelectedPath, {
      isSelected: false
    });
    state.paths[oldSelectedPathIndex] = unselectedPath;
    const yetUnselectedPath = state.paths[newSelectedRouteIndex];
    const nowSelectedPath = Object.assign({}, yetUnselectedPath, {
      isSelected: true
    });
    state.paths[newSelectedRouteIndex] = nowSelectedPath;
    return state;
  }

  parseResult(text) {
    let result = JSON.parse(text);
    return this._createPaths(result);
  }

  _createPaths(result) {
    let paths = result.paths.map(path => this._createPath(path));
    paths[this.getState().selectedRouteIndex].isSelected = true;
    return paths;
  }

  _createPath(path) {
    if (!path.legs || !path.legs.length || path.legs.length < 1)
      throw Error("The result did not contain legs");

    return {
      transfers: path.transfers,
      departureTime: path.legs[0].departureTime,
      arrivalTime: path.legs[path.legs.length - 1].arrivalTime,
      legs: this._createLegs(path.legs),
      isSelected: false
    };
  }

  _createLegs(legs) {
    return legs.map(leg => this._createLeg(leg));
  }

  _createLeg(leg) {
    return {
      departureLocation: this._findLocation(leg, true),
      arrivalLocation: this._findLocation(leg, false),
      departureTime: leg.departureTime,
      arrivalTime: leg.arrivalTime,
      geometry: leg.geometry,
      type: leg.type,
      distance: leg.distance,
      legDetails: this._createLegDetails(leg),
      distance: this._createLegDistance(leg),
      isCollapsed: true
    };
  }

  _findLocation(leg, isArrival) {
    switch (leg.type) {
      case "walk":
        return this._findWalkLocation(leg, isArrival);
      case "pt":
        return this._findPtLocation(leg, isArrival);
      default:
        throw Error(
          "find departure location for: " + leg.type + " is not implemented"
        );
    }
  }

  _findWalkLocation(leg, isArrival) {
    let instructionIndex = 0;
    let coordIndex = 0;

    if (!isArrival) {
      instructionIndex = leg.instructions.length - 1;
      coordIndex = leg.geometry.coordinates.length - 1;
    }
    if (leg.instructions[instructionIndex].street_name != "")
      return leg.instructions[instructionIndex].street_name;
    else {
      const coord = leg.geometry.coordinates[coordIndex];
      return coord[0] + ", " + coord[1];
    }
  }

  _findPtLocation(leg, isArrival) {
    let stopIndex = 0;
    if (!isArrival) stopIndex = leg.stops.length - 1;

    if (leg.stops[stopIndex].stop_name != "") {
      return leg.stops[stopIndex].stop_name;
    } else {
      const coord = leg.stops[stopIndex].geometry.coordinates;
      return coord[0] + ", " + coord[1];
    }
  }

  _createLegDetails(leg) {
    switch (leg.type) {
      case "walk":
        return this._createWalkLegDetails(leg);
      case "pt":
        return this._createPtLegDetails(leg);
      default:
        throw Error(
          "create leg details for type: " + leg.type + " is not implemented"
        );
    }
  }
  _createWalkLegDetails(leg) {
    return leg.instructions.map(instruction => {
      return {
        main: instruction.text,
        additional: instruction.sign
      };
    });
  }

  _createPtLegDetails(leg) {
    return leg.stops.map(stop => {
      return {
        main: stop.stop_name,
        additional: stop.departureTime,
        geometry: stop.geometry
      };
    });
  }

  _createLegDistance(leg) {
    switch (leg.type) {
      case "walk":
        return Math.round(leg.distance / 100 * 100) + "m";
      case "pt":
        return leg.stops.length + " Stops";
      default:
        throw Error(
          "createLegDescription for type: " + leg.type + " is not implemented"
        );
    }
  }
}

export const RouteActionType = {
  REQUEST_PATH: "RouteActionType_REQUEST_PATH",
  RECEIVE_PATH: "RouteActionType_RECEIVE_PATH",
  SELECTED_ROUTE_INDEX: "RouteActionType_SELECTED_ROUTE_INDEX"
};
