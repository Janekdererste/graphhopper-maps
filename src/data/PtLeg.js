import Leg from "./Leg.js";

export default class PtLeg extends Leg {
  get isDelayed() {
    return this._isDelayed;
  }

  constructor(apiLeg, realtimeLeg) {
    super(apiLeg);
    this._initializeRealtime(realtimeLeg);
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
    this._legDetails = this.legDetails.map(detail => {
      if (detail.main === realtimeLeg.stop_name) {
        detail.realtime = realtimeLeg.departureTime;
      } else {
        throw Error(
          "PtLeg: realtime leg and planned leg must have same stop order."
        );
      }
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
}
