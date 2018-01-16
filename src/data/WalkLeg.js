import Leg, { LegMode } from "./Leg.js";

export default class WalkLeg extends Leg {
  constructor(apiLeg) {
    super(apiLeg, LegMode.WALK);
  }

  initializeTurns(apiLeg) {
    return apiLeg.instructions.map(instruction => {
      return {
        description: instruction.text,
        sign: instruction.sign
      };
    });
  }

  initializeDistance(apiLeg) {
    return Math.round(apiLeg.distance / 100 * 100) + "m";
  }
}
