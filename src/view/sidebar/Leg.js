import React from "react";
import moment from "moment";
import { Waypoint, LegDescription, StopOnLeg, Turn } from "./TripElement.js";
import { LegType } from "../../data/Leg.js";
import IconPt from "../img/bus.png";
import IconWalk from "../img/foot.png";
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

  renderFirstWaypoint() {
    const { leg } = this.props;
    return (
      <Waypoint
        time={moment(leg.departureTime).format("HH:mm")}
        name={leg.departureLocation}
      />
    );
  }

  renderLastWaypoint() {
    const { leg } = this.props;
    return (
      <Waypoint
        time={moment(leg.arrivalTime).format("HH:mm")}
        name={leg.arrivalLocation}
        isLastLeg={true}
      />
    );
  }

  renderLegDetails() {
    const { leg } = this.props;
    return (
      <div>
        {leg.legDetails.map((detail, i) => {
          return <Turn sign={detail.additional} text={detail.main} key={i} />;
        })}
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
        {this.renderFirstWaypoint()}
        <LegDescription
          icon={this.getLegIcon()}
          onClick={() => this._handleLegDescriptionClicked()}
        >
          <div>
            <span>
              {this._calculateDuration(leg.departureTime, leg.arrivalTime)} min,{" "}
            </span>
            <span>{leg.distance}</span>
          </div>
        </LegDescription>
        {!this.state.isCollapsed ? this.renderLegDetails() : ""}
        {isLastLeg ? this.renderLastWaypoint() : ""}
      </div>
    );
  }
}

class PtLeg extends Leg {
  constructor(props) {
    super(props);
  }

  renderFirstWaypoint() {
    const { leg } = this.props;
    let time, className;

    if (leg.isDelayed) {
      className = styles.waypointTimeDelayed;
      time = leg.departureTime;
    } else {
      className = styles.waypointTime;
      time = leg.arrivalTime;
    }
    return (
      <Waypoint
        time={moment(time).format("HH:mm")}
        timeClassName={className}
        name={leg.departureLocation}
      />
    );
  }

  renderLegDetails() {
    const { leg } = this.props;
    return (
      <div>
        {leg.legDetails.map((detail, i) => {
          if (detail.additional) {
            return <StopOnLeg detail={detail} key={i} />;
          }
          return "";
        })}
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
