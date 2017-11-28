import Store from "./Store.js";
import { ParseQuery } from "./Query.js";
import Point from "./Point.js";
import moment from "moment";

export default class SearchStore extends Store {
  getInitialState() {
    return {
      from: Point.createFromArray([45.5138, -122.5769]),
      to: Point.createFromArray([45.5653, -122.661]),
      departureDateTime: new moment(),
      weighting: "fastest",
      maxWalkDistance: 1000,
      limitSolutions: 5,
      timeOption: TimeOption.NOW,
      isShowingOptions: false
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case SearchActionType.FROM:
        return Object.assign({}, state, {
          from: Point.create(action.value)
        });
      case SearchActionType.TO:
        return Object.assign({}, state, {
          to: Point.create(action.value)
        });
      case SearchActionType.WEIGHTING:
        return Object.assign({}, state, { weighting: action.value });
      case SearchActionType.DEPARTURE_TIME:
        return this._reduceDepartureTime(state, action.value);
      case SearchActionType.DEPARTURE_DATE:
        return this._reduceDepartureDate(state, action.value);
      case SearchActionType.MAX_WALK_DISTANCE:
        return Object.assign({}, state, { maxWalkDistance: action.value });
      case SearchActionType.LIMIT_SOLUTIONS:
        return Object.assign({}, state, { limitSolutions: action.value });
      case SearchActionType.SEARCH_URL_CHANGED:
        return this._reduceSearchParams(state, action.value);
      case SearchActionType.TIME_OPTION:
        return Object.assign({}, state, {
          timeOption: action.value,
          departureDateTime: new moment()
        });
      case SearchActionType.IS_SHOWING_OPTIONS:
        return Object.assign({}, state, { isShowingOptions: action.value });
      default:
        return state;
    }
  }

  _reduceDepartureTime(state, time) {
    let result = state;
    let departure = moment(time, "HH:mm");

    if (departure.isValid()) {
      departure.year(state.departureDateTime.year());
      departure.month(state.departureDateTime.month());
      departure.date(state.departureDateTime.date());
      result = Object.assign({}, state, { departureDateTime: departure });
    }
    return result;
  }

  _reduceDepartureDate(state, date) {
    let result = state;
    let departure = moment.utc(date, "YYYY-MM-DD");

    if (departure.isValid()) {
      departure.hour(state.departureDateTime.hour());
      departure.minute(state.departureDateTime.minute());
      result = Object.assign({}, state, { departureDateTime: departure });
    }
    return result;
  }

  _reduceSearchParams(state, searchParams) {
    let newState = Object.assign({}, state);
    return ParseQuery(newState, searchParams);
  }
}

const SearchActionType = {
  FROM: "SearchActionType_FROM",
  TO: "SearchActionType_TO",
  WEIGHTING: "SearchActionType_WEIGHTING",
  DEPARTURE_TIME: "SearchActionType_DEPARTURE_TIME",
  DEPARTURE_DATE: "SearchActionType_DEPARTURE_DATE",
  MAX_WALK_DISTANCE: "SearchActionType_MAX_WALK_DISTANCE",
  LIMIT_SOLUTIONS: "SearchActionType_LIMIT_SOLUTIONS",
  SEARCH_URL_CHANGED: "SearchActionType_SEARCH_URL_CHANGED",
  TIME_OPTION: "SearchActionType_TIME_OPTION",
  IS_SHOWING_OPTIONS: "SearchActionType_IS_SHOWING_OPTIONS"
};

const TimeOption = {
  NOW: 0,
  ARRIVAL: 1,
  DEPARTURE: 2
};
export { SearchActionType, TimeOption };
