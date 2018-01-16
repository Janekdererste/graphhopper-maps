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
    if (Math.random() < 0.5) {
      this._initializeRealtime(this._createDummyRealtimeLeg(apiLeg));
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

  _initializeRealtime(realtimeLeg) {
    if (!realtimeLeg) {
      return;
    }
    this._isDelayed = true;
    this._departureTime = realtimeLeg.departureTime;
    this._arrivalTime = realtimeLeg.arrivalTime;
    this._legDetails = this.turns.map((plannedStop, i) => {
      if (i < realtimeLeg.stops.length) {
        const realtimeStop = realtimeLeg.stops[i];
        if (plannedStop.name === realtimeStop.stop_name) {
          plannedStop.delay = 5;
        } else {
          throw Error(
            "PtLeg: realtime leg and planned leg must have same stop order."
          );
        }
      }
      return plannedStop;
    });
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

  _createDummyRealtimeLeg(apiLeg) {
    //create a leg with 5 minutes delay on all stops
    const stops = apiLeg.stops.map(stop => {
      return {
        stop_name: stop.stop_name,
        departureTime: moment(stop.plannedDepartureTime)
          .add(5, "m")
          .utc()
          .format(),
        plannedDepartureTime: stop.plannedDepartureTime
      };
    });
    const realtimeLeg = {
      departureTime: moment(apiLeg.departureTime)
        .add(5, "m")
        .utc()
        .format(),
      arrivalTime: moment(apiLeg.arrivalTime)
        .add(5, "m")
        .utc()
        .format(),
      stops: stops
    };
    return realtimeLeg;
  }
}
