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
    this._arrivalDelay = this._randomDelay();
    this._departureDelay = this._randomDelay();
    this._checkIfPossible(prevApiLeg, nextApiLeg);
  }

  _randomDelay() {
    let delay = (Math.random() - 0.5) * 100;
    return Math.round(delay);
  }

  _initialize(prevApiLeg, nextApiLeg) {
    if (nextApiLeg) {
      this._nextMode = nextApiLeg.type;
      this._initializeDepartureTime(nextApiLeg);
      this._initializeName(nextApiLeg, false);
    } else {
      this._type = WaypointType.LAST;
    }
    if (prevApiLeg) {
      this._prevMode = prevApiLeg.type;
      this._initializeArrivalTime(prevApiLeg);
    } else {
      this._type = WaypointType.FIRST;
    }
  }

  _initializeArrivalTime(apiLeg) {
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

  _initializeName(apiLeg, isArrival) {
    if (apiLeg.type === Mode.PT) {
      this._name = apiLeg.departureLocation;
    } else {
      this._initializeWalkLocation(apiLeg, isArrival);
    }
  }

  _initializeWalkLocation(apiLeg, isArrival) {
    let instructionIndex = 0;
    let coordIndex = 0;

    if (!isArrival) {
      instructionIndex = apiLeg.instructions.length - 1;
      coordIndex = apiLeg.geometry.coordinates.length - 1;
    }
    if (apiLeg.instructions[instructionIndex].street_name != "")
      this._name = apiLeg.instructions[instructionIndex].street_name;
    else {
      const coord = apiLeg.geometry.coordinates[coordIndex];
      this._name = coord[0] + ", " + coord[1];
    }
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
    return moment(planned).diff(moment(actual), "minutes");
  }
}

export const WaypointType = {
  FIRST: "WaypointType_FIRST",
  LAST: "WaypointType_LAST",
  INBEETWEEN: "WaypointType_INBEETWEEN"
};
