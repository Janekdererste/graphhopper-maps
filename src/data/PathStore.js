import Http from "./Http.js";
import { SearchActionType } from "./SearchStore.js";

export default class PathStore {
  static ENDPOINT() {
    return "http://dbms-env.eu-central-1.elasticbeanstalk.com";
  }

  set search(search) {
    this.state.search = search;
  }

  get search() {
    return this.state.search;
  }

  constructor(search) {
    this.state = {
      isFetching: false,
      search: search
    };
    this.query = `/route?point=52.5141,13.4963&point=52.516116401541495,13.448467254638674&locale=en-US&vehicle=pt&weighting=fastest&elevation=false&pt.earliest_departure_time=2017-09-26T12%3A50%3A42.020Z&use_miles=false&points_encoded=false&pt.max_walk_distance_per_leg=1000&pt.profile=true&pt.limit_solutions=5`;
  }

  handleAction(action) {
    switch (action.type) {
      case PathActionType.REQUEST_PATH:
        this.state = Object.assign({}, this.state, { isFetching: true });
        return this.state;
      case PathActionType.RECEIVE_PATH:
        this.state = Object.assign({}, this.state, {
          isFetching: false,
          paths: action.value
        });
        return this.state;
      default:
        return this.state;
    }
  }

  requestPath(callback, error) {
    const query = this.createQuery();
    console.log(query);
    const url = PathStore.ENDPOINT() + this.createQuery();
    let self = this;
    Http.makeGETRequest(
      url,
      text => this.parseResult(text, callback, error),
      error
    );
  }

  createQuery() {
    return (
      "/route?point=" +
      this.state.search.from[0] +
      "," +
      this.state.search.from[1] +
      "&point=" +
      this.state.search.to +
      "&locale=en-US&vehicle=pt&weighting=" +
      this.state.search.weighting +
      "&elevation=false&pt.earliest_departure_time=" +
      this.state.search.departureTime +
      "&use_miles=false&points_encoded=false&pt.max_walk_distance_per_leg=" +
      this.state.search.maxWalinkDistance +
      "&pt.profile=true&pt.limit_solutions=" +
      this.state.search.limitSolutions
    );
  }

  parseResult(text, callback, error) {
    let result = JSON.parse(text);
    this.paths = result.paths;
    console.log(result);
    callback(this.paths);
  }
}

export const PathActionType = {
  REQUEST_PATH: 0,
  RECEIVE_PATH: 1
};
