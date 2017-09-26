import Http from "./Http.js";

export default class SearchStore {
  static ENDPOINT() {
    return "http://dbms-env.eu-central-1.elasticbeanstalk.com";
  }
  constructor() {
    this.query = `/route?point=52.5141,13.4963&point=52.516116401541495,13.448467254638674&locale=en-US&vehicle=pt&weighting=fastest&elevation=false&pt.earliest_departure_time=2017-09-26T12%3A50%3A42.020Z&use_miles=false&points_encoded=false&pt.max_walk_distance_per_leg=1000&pt.profile=true&pt.limit_solutions=5`;
    this.queryResult = "";
  }

  search(callback, error) {
    const url = SearchStore.ENDPOINT() + this.query;
    let self = this;
    Http.makeGETRequest(
      url,
      text => this.parseResult(text, callback, error),
      error => {
        error(error);
      }
    );
  }

  parseResult(text, callback, error) {
    let result = JSON.parse(text);
    this.paths = result.paths;
    console.log(result);
    callback(this.paths);
  }
}
