import Http from "./Http.js";
import Dispatcher from "./Dispatcher.js";

const endpoint = "http://dbms-env.eu-central-1.elasticbeanstalk.com";

export default {
  queryRoute(query) {
    const url = endpoint + query;
    Http.makeGETRequest(
      url,
      text => {
        Dispatcher.dispatch({
          type: DataManagerActionType.RECEIVED_ROUTE,
          value: text
        });
      },
      error =>
        Dispatcher.dispatch({
          type: DataManagerActionType.ROUTE_QUERY_ERROR,
          value: error.message
        })
    );
  }
};

export const DataManagerActionType = {
  RECEIVED_ROUTE: "DataManagerActionType_RECEIVED_ROUTE",
  ROUTE_QUERY_ERROR: "DataManagerActionType_ROUTE_QUERY_ERROR"
};
