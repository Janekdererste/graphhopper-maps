import Leg from "./Leg.js";

export default class WalkLeg extends Leg {
  constructor(apiLeg) {
    super(apiLeg);
  }

  initializeDepartureLocation(apiLeg) {
    return this._findLocation(apiLeg, false);
  }

  initialzeArrivalLocation(apiLeg) {
    return this._findLocation(apiLeg, true);
  }

  initializeLegDetails(apiLeg) {
    return apiLeg.instructions.map(instruction => {
      return {
        main: instruction.text,
        additional: instruction.sign
      };
    });
  }

  initializeLegDistance(apiLeg) {
    return Math.round(apiLeg.distance / 100 * 100) + "m";
  }

  _findLocation(apiLeg, isArrival) {
    let instructionIndex = 0;
    let coordIndex = 0;

    if (!isArrival) {
      instructionIndex = apiLeg.instructions.length - 1;
      coordIndex = apiLeg.geometry.coordinates.length - 1;
    }
    if (apiLeg.instructions[instructionIndex].street_name != "")
      return apiLeg.instructions[instructionIndex].street_name;
    else {
      const coord = apiLeg.geometry.coordinates[coordIndex];
      return coord[0] + ", " + coord[1];
    }
  }
}
