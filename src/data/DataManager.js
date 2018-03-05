import Http from "./Http.js";
import Dispatcher from "./Dispatcher.js";

const endpoint = "http://graphhopper-trimet.eu-central-1.elasticbeanstalk.com";

class DataManager {
  constructor() {
    this._requestCount = 0;
  }

  isFetching() {
    return this._isFetching;
  }

  queryRoute(query) {
    const url = endpoint + query;

    this.query(
      url,
      DataManagerActionType.RECEIVED_ROUTE,
      DataManagerActionType.ROUTE_QUERY_ERROR
    );
  }

  queryEndpointInfo(query) {
    const url = endpoint + query;
    Http.makeGETRequest(url, "info", (id, info) => Dispatcher.dispatch({
      type: DataManagerActionType.RECEIVED_INFO,
      value: info
    }), (id, error) => Dispatcher.dispatch({
      type: DataManagerActionType.INFO_QUERY_ERROR,
      value: error.message
    }));
  }

  query(url, successActionType, errorActionType) {
    console.log(url);
    this._requestCount++;
    this._isFetching = true;
    Dispatcher.dispatch({ type: DataManagerActionType.QUERY_DATA });
    Http.makeGETRequest(
      url,
      this._requestCount,
      (reqId, text) => {
        if (reqId === this._requestCount) {
          this._isFetching = false;
          Dispatcher.dispatch({
            type: successActionType,
            value: text
          });
        }
      },
      (reqId, error) => {
        if (reqId === this._requestCount) {
          this._isFetching = false;
          Dispatcher.dispatch({
            type: errorActionType,
            value: error.message
          });
        }
      }
    );
  }
}
export default new DataManager();

export const DataManagerActionType = {
  QUERY_DATA: "DataManagerActionType_QUERY_DATA",
  RECEIVED_ROUTE: "DataManagerActionType_RECEIVED_ROUTE",
  RECEIVED_INFO: "DataManagerActoinType_RECEIVED_INFO",
  ROUTE_QUERY_ERROR: "DataManagerActionType_ROUTE_QUERY_ERROR",
  INFO_QUERY_ERROR: "DataManagerActionType_INFO_QUERY_ERROR"
};
