import Store from "./Store.js";

export default class SearchStore extends Store {
  getInitialState() {
    return {
      from: [52.5141, 13.4963],
      to: [52.46521370191653, 13.43559265136719],
      time: new Date(Date.now()).toISOString(),
      time: 0,
      weighting: "fastest",
      maxWalkDistance: 1000,
      limitSolutions: 3,
      timeOption: TimeOption.NOW
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case SearchActionType.FROM:
        return Object.assign({}, state, { from: action.value });
      case SearchActionType.TO:
        return Object.assign({}, state, { to: action.value });
      case SearchActionType.WEIGHTING:
        return Object.assign({}, state, { weighting: action.value });
      case SearchActionType.DEPARTURE_TIME:
        return Object.assign({}, state, { departureTime: action.value });
      case SearchActionType.MAX_WALK_DISTANCE:
        return Object.assign({}, state, { maxWalkDistance: action.value });
      case SearchActionType.LIMIT_SOLUTIONS:
        return Object.assign({}, state, { limitSolutions: action.value });
      case SearchActionType.TIME_OPTION:
        return Object.assign({}, state, {
          timeOption: action.value,
          time: new Date(Date.now()).toISOString()
        });
      default:
        return state;
    }
  }
}

const SearchActionType = {
  FROM: "SearchActionType_FROM",
  TO: "SearchActionType_TO",
  WEIGHTING: "SearchActionType_WEIGHTING",
  DEPARTURE_TIME: "SearchActionType_DEPARTURE_TIME",
  MAX_WALK_DISTANCE: "SearchActionType_MAX_WALK_DISTANCE",
  LIMIT_SOLUTIONS: "SearchActionType_LIMIT_SOLUTIONS",
  TIME_OPTION: "SearchActionType_TIME_OPTION"
};

const TimeOption = {
  NOW: 0,
  ARRIVAL: 1,
  DEPARTURE: 2
};
export { SearchActionType, TimeOption };
