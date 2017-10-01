import { TimeOption } from "./SearchStore.js";

export default class Query {
  constructor(search) {
    this._createQuery(search);
  }

  get query() {
    return this._query;
  }

  _createQuery(search) {
    let query = "/route?";
    query += "&" + this._pointParameter(search.from);
    query += "&" + this._pointParameter(search.to);
    query += "&" + this._weighting(search);
    query += "&" + this._departureTime(search);
    query += "&" + this._maxWalkDistance(search);
    query += "&" + this._limitSolutions(search);
    query += "&" + this._staticProperties();
    this._query = query;
  }

  _pointParameter(point) {
    return "point=" + point[0] + "," + point[1];
  }

  _weighting(search) {
    return "weighting=" + search.weighting;
  }

  _departureTime(search) {
    let result = "pt.earliest_departure_time=";
    if (search.timeOption == TimeOption.NOW) {
      result += new Date(Date.now()).toISOString();
    } else {
      result += search.time;
      if (search.timeOption == TimeOption.ARRIVAL) {
        result += "&arrive_by=true";
      }
    }
    return result;
  }

  _maxWalkDistance(search) {
    return "pt.max_walk_distance_per_leg=" + search.maxWalkDistance;
  }

  _limitSolutions(search) {
    return "pt.limit_solutions=" + search.limitSolutions;
  }

  _staticProperties() {
    return "locale=en-US&vehicle=pt&elevation=false&use_mile=false&points_encoded=false&pt.profile=true";
  }
}
