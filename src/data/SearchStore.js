export default class SearchStore {
  constructor() {
    this.from = [52.5141, 13.4963];
    this.to = [52.46521370191653, 13.43559265136719];
    this.weighting = "fastest";
    this.departureTime = Date.now();
    this.maxWalkDistance = 1000;
    this.limitSolutions = 3;
  }

  static updateSearch(state, action) {
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
      default:
        return state;
    }
  }
}

const SearchActionType = {
  FROM: 0,
  TO: 1,
  WEIGHTING: 2,
  DEPARTURE_TIME: 3,
  MAX_WALK_DISTANCE: 4,
  LIMIT_SOLUTIONS: 5
};
export { SearchActionType };
