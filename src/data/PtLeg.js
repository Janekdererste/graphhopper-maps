import Leg, { LegMode } from "./Leg.js";

//import moments only for the dummy Realtime leg
import moment from "moment";

export default class PtLeg extends Leg {
  get isDelayed() {
    return this._isDelayed;
  }

  constructor(apiLeg) {
    super(apiLeg, LegMode.PT);

    //create a delayed leg from time to time
    const rand = Math.random();
    if (rand < 0.3) {
      this._turns.forEach(turn => {
        turn.delay = 5;
      });
    } else if (0.7 >= rand >= 0.3) {
      this._turns.forEach(turn => {
        turn.delay = -5;
      });
    }
  }

  initializeTurns(apiLeg) {
    return apiLeg.stops.map(stop => {
      return {
        name: stop.stop_name,
        departureTime: stop.plannedDepartureTime,
        delay: this._calculateDelay(
          stop.departureTime,
          stop.plannedDepartureTime
        ),
        geometry: stop.geometry
      };
    });
  }

  initializeDistance(apiLeg) {
    return apiLeg.stops.length + " Stops";
  }

  _calculateDelay(actual, planned) {
    let actualTime = moment(actual);
    let plannedTime = moment(planned);
    let diff = actualTime.diff(plannedTime, "minutes");
    return diff;
  }

  _findLocation(apiLeg, isArrival) {
    let stopIndex = 0;
    if (!isArrival) stopIndex = apiLeg.stops.length - 1;

    if (apiLeg.stops[stopIndex].stop_name != "") {
      return apiLeg.stops[stopIndex].stop_name;
    } else {
      const coord = apiLeg.stops[stopIndex].geometry.coordinates;
      return coord[0] + ", " + coord[1];
    }
  }
}
