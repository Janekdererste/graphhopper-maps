export default class Http {
  static STATUS_OK() {
    return 200;
  }

  static isRequestDone(request) {
    return request.readyState === XMLHttpRequest.DONE;
  }

  static isStatusSuccess(request) {
    return request.status === Http.STATUS_OK();
  }

  static makeGETRequest(url, success, error) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () =>
      this.readyStateChangedHandler(request, success, error);
    request.open("GET", url);
    request.responseType = "text";
    request.send(null);
  }

  static readyStateChangedHandler(request, success, error) {
    if (Http.isRequestDone(request)) {
      if (Http.isStatusSuccess(request)) {
        success(request.response);
      } else {
        console.log("Error in Webrequest. Code: " + request.status);
        if (error) {
          error({ message: "error in web request", status: request.status });
        }
      }
    }
  }
}
