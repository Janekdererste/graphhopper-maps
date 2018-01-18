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

  _getDepartureTime(apiStop) {
    return apiStop.plannedDepartureTime
      ? apiStop.plannedDepartureTime
      : apiStop.departureTime;
  }
}
