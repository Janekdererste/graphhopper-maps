import moment from "moment";

import WalkLeg from "./WalkLeg.js";
import PtLeg from "./PtLeg.js";
import { LegMode } from "./Leg.js";
import Waypoint from "./Waypoint.js";

export default class Path {
  get transfers() {
    return this._waypoints;
  }

  get legs() {
    return this._legs;
  }

  get departureTime() {
    return this._departureTime;
  }

  get arrivalTime() {
    return this._arrivalTime;
  }

  get durationInMinutes() {
    return moment(this._arrivalTime).diff(this._departureTime);
  }

  get fare() {
    return this._fare;
  }

  get isSelected() {
    return this._isSelected;
  }
  set isSelected(value) {
    this._isSelected = value;
  }

  get isPossible() {
    return this._isPossible;
  }

  constructor(apiPath) {
    this._validate(apiPath);
    this._initializeSimpleValues(apiPath);
    this._initializeLegsAndTransfers(apiPath);
  }

  _validate(apiPath) {
    if (!apiPath.legs || !apiPath.legs.length || apiPath.legs.length < 1) {
      throw Error("apiPath didn't contain any legs!");
    }
  }

  _initializeSimpleValues(apiPath) {
    this._isSelected = false;
    this._departureTime = apiPath.departureTime;
    this._arrivalTime = apiPath.arrivalTime;
    this._fare = apiPath.fare;
  }

  _initializeLegsAndTransfers(apiPath) {
    this._legs = [];
    this._waypoints = [];

    apiPath.legs.forEach((apiLeg, i) => {
      this.legs.push(this._initializeLeg(apiLeg));
      if (i > 0)
        this._waypoints.push(new Waypoint(apiLeg, apiPath.legs[i - 1]));
      else if (i === apiPath.legs.length - 1)
        this.transfers.push(new Waypoint(apiLeg, null));
      else this._waypoints.push(new Waypoint(null, apiLeg));
    });
  }

  _initializeLeg(apiLeg) {
    switch (apiLeg.type) {
      case LegMode.WALK:
        return new WalkLeg(apiLeg);
      case LegMode.PT:
        return new PtLeg(apiLeg);
      default:
        throw new Error("leg type: " + apiLeg.type + " not yet implemented");
    }
  }
}
