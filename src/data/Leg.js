export default class Leg {
  get departureTime() {
    return this._departureTime;
  }
  get plannedDepartureTime() {
    return this._plannedDepartureTime;
  }
  get arrivalTime() {
    return this._arrivalTime;
  }
  get plannedArrivalTime() {
    return this._plannedArrivalTime;
  }
  get departureLocation() {
    return this._departureLocation;
  }
  get arrivalLovation() {
    return this._arrivalLocation;
  }
  get geometry() {
    return this._geometry;
  }
  get type() {
    return this._type;
  }
  get distance() {
    return this._distance;
  }
  get legDetails() {
    return this._legDetails;
  }
  get distance() {
    return this._distance;
  }

  constructor(apiLeg) {
    this._departureTime = apiLeg.departureTime;
    this._plannedDepartureTime = this._departureTime;
    this._arrivalTime = apiLeg.arrivalTime;
    this._plannedArrivalTime = this._arrivalTime;
    this._geometry = apiLeg.geometry;
    this._type = apiLeg.type;
    this._distance = apiLeg.distance;
    this._departureLocation = this.initializeDepartureLocation(apiLeg);
    this._arrivalLocation = this.initialzeArrivalLocation(apiLeg);
    this._legDetails = this.initializeLegDetails(apiLeg);
    this._distance = this.initializeLegDistance(apiLeg);
  }

  initializeDepartureLocation(apiLeg) {
    throw Error("initializeDepartureLocation must be implemented by subclass");
  }

  initialzeArrivalLocation(apiLeg) {
    throw Error("initialzeArrivalLocation must be implemented by subclass");
  }

  initializeLegDetails(apiLeg) {
    throw Error("initializeLegDetails must be implemented by subclass");
  }

  initializeLegDistance(apiLeg) {
    throw Error("initializeLegDistance must be implemented by subclass");
  }
}

export const LegType = {
  WALK: "walk",
  PT: "pt"
};
