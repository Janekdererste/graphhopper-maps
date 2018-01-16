import moment from "moment";

export default class Leg {
  get geometry() {
    return this._geometry;
  }

  get type() {
    return this._type;
  }

  get turns() {
    return this._turns;
  }

  get distance() {
    return this._distance;
  }

  get departureTime() {
    return this._departureTime;
  }

  get arrivalTime() {
    return this._arrivalTime;
  }

  constructor(apiLeg, type) {
    this._geometry = apiLeg.geometry;
    this._type = type;
    this._departureTime = apiLeg.departureTime;
    this._arrivalTime = apiLeg.arrivalTime;
    this._turns = this.initializeTurns(apiLeg);
    this._distance = this.initializeDistance(apiLeg);
  }

  initializeTurns(apiLeg) {
    throw Error("initializeTurns must be implemented by subclass");
  }

  initializeDistance(apiLeg) {
    throw Error("initializeLegDistance must be implemented by subclass");
  }
}

export const LegMode = {
  WALK: "walk",
  PT: "pt"
};
