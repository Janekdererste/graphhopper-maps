import React from "react";
import moment from "moment";
import {
  Waypoint,
  LegDescription,
  StopOnLeg,
  Turn,
  Padding
} from "./TripElement.js";
import { LegMode } from "../../data/Leg.js";
import IconPt from "../img/bus.png";
import IconWalk from "../img/foot.png";
import Arrow from "../img/arrow.svg";
import styles from "./Leg.css";

class Leg extends React.Component {
  constructor(props) {
    super(props);
    this._validateProps(props);
    this.state = {
      isCollapsed: true
    };
  }

  _validateProps(props) {
    if (!props.leg) throw Error("Leg component requires property 'leg'");
  }

  _calculateDuration(departure, arrival) {
    return moment(arrival).diff(moment(departure), "minutes");
  }

  _handleLegDescriptionClicked() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  renderLegDetails() {
    const { leg } = this.props;
    return (
      <div>
        {leg.turns.map((turn, i) => {
          return <Turn sign={turn.sign} text={turn.description} key={i} />;
        })}
        <Padding />
      </div>
    );
  }

  getLegIcon() {
    return IconWalk;
  }

  render() {
    const { leg, onClick, isLastLeg } = this.props;
    return (
      <div>
        <LegDescription
          icon={this.getLegIcon()}
          onClick={() => this._handleLegDescriptionClicked()}
        >
          <div className={styles.legDescriptionDetails}>
            <span>
              {this._calculateDuration(leg.departureTime, leg.arrivalTime)}{" "}
              min,&nbsp;
            </span>
            <span>{leg.distance}</span>
            <div
              dangerouslySetInnerHTML={{ __html: Arrow }}
              className={
                this.state.isCollapsed
                  ? styles.carrotContainer
                  : styles.carrotContainerFlipped
              }
            />
          </div>
        </LegDescription>
        {!this.state.isCollapsed ? this.renderLegDetails() : ""}
      </div>
    );
  }
}

class PtLeg extends Leg {
  constructor(props) {
    super(props);
  }

  renderLegDetails() {
    const { leg } = this.props;
    return (
      <div>
        {leg.turns.map((stop, i) => {
          if (stop.name) {
            return (
              <StopOnLeg
                name={stop.name}
                time={moment(stop.departureTime).format("HH:mm")}
                delay={stop.delay}
                key={i}
              />
            );
          }
          return "";
        })}
        <Padding />
      </div>
    );
  }

  getLegIcon() {
    return IconPt;
  }
}

class WalkLeg extends Leg {
  constructor(props) {
    super(props);
  }
}

export { Leg, PtLeg, WalkLeg };
