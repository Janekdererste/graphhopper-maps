import moment from "moment";
import { TimeOption } from "./SearchStore.js";
import Point from "./Point.js";

const QUERY_PATH = "/route";
const POINT = "point";
const WEIGHTING = "weighting";
const DEPARTURE_TIME = "pt.earliest_departure_time";
const ARRIVE_BY = "arrive_by";
const MAX_WALK_DIST = "pt.max_walk_distance_per_leg";
const LIMIT_SOLUTIONS = "pt.limit_solutions";

const createQuery = search => {
  let url = new URL(QUERY_PATH, window.location.origin);

  function pointParameter(point) {
    url.searchParams.append(POINT, [point.lat, point.long]);
  }

  function weighting(search) {
    url.searchParams.append(WEIGHTING, search.weighting);
  }

  function departureTime(search) {
    let time = search.departureDateTime.utc().format();
    url.searchParams.append(DEPARTURE_TIME, time);

    if (search.timeOption == TimeOption.ARRIVAL) {
      url.searchParams.append(ARRIVE_BY, true);
    } else {
      url.searchParams.append(ARRIVE_BY, false);
    }
  }

  function maxWalkDistance(search) {
    url.searchParams.append(MAX_WALK_DIST, search.maxWalkDistance);
  }

  function limitSolutions(search) {
    url.searchParams.append(LIMIT_SOLUTIONS, search.limitSolutions);
  }

  function staticProperties() {
    url.searchParams.append("locale", "en-US");
    url.searchParams.append("vehicle", "pt");
    url.searchParams.append("elevation", false);
    url.searchParams.append("use_miles", false);
    url.searchParams.append("points_encoded", false);
    url.searchParams.append("pt.profile", true);
  }

  pointParameter(search.from);
  pointParameter(search.to);
  weighting(search);
  departureTime(search);
  maxWalkDistance(search);
  limitSolutions(search);
  staticProperties();

  return url.pathname + url.search;
};

const parseQuery = (search, searchParams) => {
  function parsePoints(searchParams) {
    const points = searchParams.getAll(POINT);
    if (points.length == 2) {
      search.from = Point.createFromString(points[0]);
      search.to = Point.createFromString(points[1]);
    }
  }

  function parseDepartureTime(searchParams) {
    const departureDateTime = searchParams.get(DEPARTURE_TIME);
    if (departureDateTime) {
      search.departureDateTime = moment(departureDateTime);

      const arriveBy = searchParams.get(ARRIVE_BY);
      if (arriveBy && arriveBy === true) {
        search.timeOption = TimeOption.ARRIVAL;
      } else {
        search.timeOption = TimeOption.DEPARTURE;
      }
    }
  }

  function parse(urlKey, searchKey, searchParams) {
    const value = searchParams.get(urlKey);
    if (value) {
      search[searchKey] = value;
    }
  }

  parsePoints(searchParams);
  parse(WEIGHTING, "weighting", searchParams);
  parseDepartureTime(searchParams);
  parse(MAX_WALK_DIST, "maxWalkDistance", searchParams);
  parse(LIMIT_SOLUTIONS, "limitSolutions", searchParams);
  return search;
};

export { createQuery, parseQuery };
