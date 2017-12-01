import { LegType } from "./Leg.js";
import WalkLeg from "./WalkLeg.js";
import PtLeg from "./PtLeg.js";

export default class RealtimePath {
  get transfers() {
    return this._transfers;
  }
  get plannedDepartureTime() {
    return this._plannedDepartureTime;
  }
  get departureTime() {
    return this._departureTime;
  }
  get plannedArrivalTime() {
    return this._plannedArrivalTime;
  }
  get arrivalTime() {
    return this._arrivalTime;
  }
  get isSelected() {
    return this._isSelected;
  }
  get fare() {
    return this._fare;
  }

  set isSelected(value) {
    this._isSelected = value;
  }
  get legs() {
    return this._legs;
  }

  constructor(apiPath) {
    this._validate(apiPath);
    this._isDelayed = false;
    this._isInvalid = false;
    this._copySimpleValues(apiPath);
    this._initializeLegs(apiPath);
  }

  _validate(apiPath) {
    if (!apiPath.legs || !apiPath.legs.length || apiPath.legs.length < 1)
      throw Error("API-Path didn't contain any legs.");
  }

  _copySimpleValues(apiPath) {
    this._transfers = apiPath.transfers;
    this._departureTime = apiPath.legs[0].departureTime;
    this._plannedArrivalTime = this._departureTime;
    this._arrivalTime = apiPath.legs[apiPath.legs.length - 1].arrivalTime;
    this._plannedArrivalTime = this._arrivalTime;
    this._isSelected = false;
    this._fare = apiPath.fare;
  }

  _initializeLegs(apiPath) {
    this._legs = apiPath.legs.map(apiLeg => {
      let realtimeLeg = null;
      return this._initializeLeg(apiLeg);
    });
  }

  _initializeLeg(apiLeg) {
    switch (apiLeg.type) {
      case LegType.WALK:
        return new WalkLeg(apiLeg);
      case LegType.PT:
        return new PtLeg(apiLeg);
      default:
        throw new Error("leg type: " + apiLeg.type + " not yet implemented");
    }
  }

  static createFromAPIPath(apiPath) {
    return new RealtimePath(apiPath);
  }
}
