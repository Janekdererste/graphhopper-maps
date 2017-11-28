import Leg from "./Leg.js";

//import moments only for the dummy Realtime leg
import moment from "moment";

export default class PtLeg extends Leg {
  get isDelayed() {
    return this._isDelayed;
  }

  constructor(apiLeg) {
    super(apiLeg);

    //create a delayed leg from time to time
    if (Math.random() < 0.5) {
      this._initializeRealtime(this._createDummyRealtimeLeg(apiLeg));
    }
  }

  initializeDepartureLocation(apiLeg) {
    return this._findLocation(apiLeg, false);
  }

  initialzeArrivalLocation(apiLeg) {
    return this._findLocation(apiLeg, true);
  }

  initializeLegDetails(apiLeg) {
    return apiLeg.stops.map(stop => {
      return {
        main: stop.stop_name,
        additional: stop.departureTime,
        geometry: stop.geometry
      };
    });
  }

  initializeLegDistance(apiLeg) {
    return apiLeg.stops.length + " Stops";
  }

  _initializeRealtime(realtimeLeg) {
    if (!realtimeLeg) {
      return;
    }
    this._isDelayed = true;
    this._departureTime = realtimeLeg.departureTime;
    this._arrivalTime = realtimeLeg.arrivalTime;
    this._legDetails = this.legDetails.map((plannedStop, i) => {
      if (i < realtimeLeg.stops.length) {
        const realtimeStop = realtimeLeg.stops[i];
        if (plannedStop.main === realtimeStop.stop_name) {
          plannedStop.realtime = realtimeStop.departureTime;
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
        departureTime: moment(stop.departureTime)
          .add(5, "m")
          .utc()
          .format()
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
