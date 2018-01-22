import moment from "moment";
import { LegMode as Mode } from "./Leg.js";

export default class Waypoint {
  get prevMode() {
    return this._prevMode;
  }

  get arrivalTime() {
    return this._arrivalTime;
  }

  get arrivalDelay() {
    return this._arrivalDelay;
  }

  get nextMode() {
    return this._nextMode;
  }

  get departureTime() {
    return this._departureTime;
  }

  get departureDelay() {
    return this._departureDelay;
  }

  get name() {
    return this._name;
  }

  get geometry() {
    return this._geometry;
  }

  get isPossible() {
    return this._isPossible;
  }

  get type() {
    return this._type;
  }

  constructor(prevApiLeg, nextApiLeg) {
    this._departureDelay = 0;
    this._type = WaypointType.INBEETWEEN;
    this._isPossible = true;
    this._initialize(prevApiLeg, nextApiLeg);
    this._checkIfPossible(prevApiLeg, nextApiLeg);
  }

  _randomDelay() {
    let delay = (Math.random() - 0.5) * 100;
    return Math.round(delay);
  }

  _initialize(prevApiLeg, nextApiLeg) {
    this._initializeName(prevApiLeg, nextApiLeg);
    this._initializeMode(prevApiLeg, nextApiLeg);
    this._initializeDepartureTime(nextApiLeg);
    this._initializeWaypointType(prevApiLeg, nextApiLeg);
    this._initializeArrivalTime(prevApiLeg);
    this._initializeGeometry(prevApiLeg, nextApiLeg, this._type);
  }

  _initializeName(prevApiLeg, nextApiLeg) {
    if (nextApiLeg) {
      if (nextApiLeg.type === Mode.PT) {
        this._name = nextApiLeg.departureLocation;
      } else if (prevApiLeg) {
        this._name = this._findArrivalLocation(prevApiLeg);
      } else {
        this._name = this._findWalkLocation(nextApiLeg, false);
      }
    } else if (prevApiLeg) {
      this._name = this._findWalkLocation(prevApiLeg, true);
    }
  }

  _initializeMode(prevApiLeg, nextApiLeg) {
    if (prevApiLeg) this._prevMode = prevApiLeg.type;
    if (nextApiLeg) this._nextMode = nextApiLeg.type;
  }

  _initializeWaypointType(prevApiLeg, nextApiLeg) {
    this._type = WaypointType.INBEETWEEN;
    if (!prevApiLeg) {
      this._type = WaypointType.FIRST;
    }
    if (!nextApiLeg) {
      this._type = WaypointType.LAST;
    }
  }

  _initializeArrivalTime(apiLeg) {
    if (!apiLeg) return;
    if (apiLeg.type === Mode.PT) {
      let lastStop = apiLeg.stops[apiLeg.stops.length - 1];
      this._arrivalTime = lastStop.plannedArrivalTime;
      this._arrivalDelay = this._calculateDelay(
        lastStop.arrivalTime,
        this._arrivalTime
      );
    } else {
      this._arrivalTime = apiLeg.arrivalTime;
    }
  }

  _initializeDepartureTime(apiLeg) {
    if (!apiLeg) return;
    if (apiLeg.type === Mode.PT) {
      this._departureTime = apiLeg.stops[0].plannedDepartureTime;
      this._departureDelay = this._calculateDelay(
        apiLeg.stops[0].departureTime,
        this._departureTime
      );
    } else {
      this._departureTime = apiLeg.departureTime;
    }
  }

  _initializeGeometry(prevApiLeg, nextApiLeg, waypointType) {
    let result = "";
    if (waypointType === WaypointType.INBEETWEEN) {
      if (nextApiLeg.type === Mode.PT) {
        result = nextApiLeg.stops[0].geometry;
      } else if (prevApiLeg) {
        result = prevApiLeg.stops[prevApiLeg.stops.length - 1].geometry;
      }
    }
    this._geometry = result;
  }

  _findArrivalLocation(apiLeg) {
    return apiLeg.stops[apiLeg.stops.length - 1].stop_name;
  }

  _findWalkLocation(apiLeg, isArrival) {
    let instructionIndex = 0;
    let coordIndex = 0;
    let result = "";

    if (isArrival) {
      instructionIndex = apiLeg.instructions.length - 1;
      coordIndex = apiLeg.geometry.coordinates.length - 1;
    }
    if (apiLeg.instructions[instructionIndex].street_name != "")
      result = apiLeg.instructions[instructionIndex].street_name;
    else {
      const coord = apiLeg.geometry.coordinates[coordIndex];
      result = coord[0] + ", " + coord[1];
    }
    return result;
  }

  _checkIfPossible(prevApiLeg, nextApiLeg) {
    if (
      prevApiLeg &&
      nextApiLeg &&
      prevApiLeg.type === Mode.PT &&
      nextApiLeg.type === Mode.PT
    ) {
      let buffer = moment(this.departureTime)
        .add(this.departureDelay, "minutes")
        .diff(moment(this.arrivalTime).add(this.arrivalDelay, "minutes"));
      this._isPossible = buffer >= 0;
    }
  }

  _calculateDelay(actual, planned) {
    return moment(actual).diff(moment(planned), "minutes");
  }
}

export const WaypointType = {
  FIRST: "WaypointType_FIRST",
  LAST: "WaypointType_LAST",
  INBEETWEEN: "WaypointType_INBEETWEEN"
};
