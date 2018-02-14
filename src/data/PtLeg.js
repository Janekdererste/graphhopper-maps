import Leg, { LegMode } from "./Leg.js";

//import moments only for the dummy Realtime leg
import moment from "moment";

export default class PtLeg extends Leg {
  get isDelayed() {
    return this._isDelayed;
  }

  constructor(apiLeg) {
    super(apiLeg, LegMode.PT);
  }

  initializeTurns(apiLeg) {
    let result = [];

    //leave out first and last stop since they are displayed as waypoint
    for (let i = 1; i < apiLeg.stops.length - 1; i++) {
      const apiStop = apiLeg.stops[i];
      let stop = {
        name: apiStop.stop_name,
        departureTime: this._getDepartureTime(apiStop),
        delay: this._calculateDelay(
          apiStop.departureTime,
          apiStop.plannedDepartureTime
        ),
        isCancelled: apiStop.arrivalCancelled || apiStop.departureCancelled,
        geometry: apiStop.geometry
      };
      result.push(stop);
    }
    return result;
  }

  initializeDistance(apiLeg) {
    //The first stop is where passengers enter thus n - 1 stops to go on this leg
    return apiLeg.stops.length - 1 + " Stops";
  }

  _calculateDelay(actual, planned) {
    if (!actual || !planned) {
      return 0;
    }

    let actualTime = moment(actual);
    let plannedTime = moment(planned);
    let diff = actualTime.diff(plannedTime, "minutes");
    return diff;
  }

  _getDepartureTime(apiStop) {
    return apiStop.plannedDepartureTime
      ? apiStop.plannedDepartureTime
      : apiStop.departureTime;
  }
}
