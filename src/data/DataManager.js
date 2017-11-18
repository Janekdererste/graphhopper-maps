import Http from "./Http.js";
import Dispatcher from "./Dispatcher.js";

const endpoint = "http://graphhopper-trimet.eu-central-1.elasticbeanstalk.com";

export default {
  queryRoute(query) {
    const url = endpoint + query;

    this.query(
      url,
      DataManagerActionType.RECEIVED_ROUTE,
      DataManagerActionType.ROUTE_QUERY_ERROR
    );
  },

  queryEndpointInfo(query) {
    const url = endpoint + query;
    this.query(
      url,
      DataManagerActionType.RECEIVED_INFO,
      DataManagerActionType.INFO_QUERY_ERROR
    );
  },

  query(url, successActionType, errorActionType) {
    console.log(url);
    Http.makeGETRequest(
      url,
      text =>
        Dispatcher.dispatch({
          type: successActionType,
          value: text
        }),
      error =>
        Dispatcher.dispatch({
          type: errorActionType,
          value: error.message
        })
    );
  }
};

export const DataManagerActionType = {
  RECEIVED_ROUTE: "DataManagerActionType_RECEIVED_ROUTE",
  RECEIVED_INFO: "DataManagerActoinType_RECEIVED_INFO",
  ROUTE_QUERY_ERROR: "DataManagerActionType_ROUTE_QUERY_ERROR",
  INFO_QUERY_ERROR: "DataManagerActionType_INFO_QUERY_ERROR"
};
