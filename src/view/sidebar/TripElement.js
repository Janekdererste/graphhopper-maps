import React from "react";
import moment from "moment";
import { WaypointType } from "../../data/Waypoint.js";
import { LegMode } from "../../data/Leg.js";

import SecondaryText from "../components/SecondaryText.js";
import styles from "./TripElement.css";

const Waypoint = ({ waypoint }) => {
  function getTime(waypoint) {
    let time;
    if (waypoint.type === WaypointType.LAST) {
      time = waypoint.arrivalTime;
    } else {
      time = waypoint.departureTime;
    }

    return moment(time).format("HH:mm");
  }

  function getDelay(waypoint) {
    return waypoint.departureDelay !== 0 && waypoint.nextMode !== LegMode.WALK
      ? " +" + waypoint.departureDelay
      : "";
  }

  function getArrivalTime(waypoint) {
    return waypoint.type === WaypointType.INBEETWEEN &&
      waypoint.prevMode === LegMode.PT ? (
      <div>
        <SecondaryText>
          {moment(waypoint.arrivalTime).format("HH:mm")}
        </SecondaryText>
        <SecondaryText> {getArrivalDelay(waypoint)}</SecondaryText>
      </div>
    ) : (
      ""
    );
  }

  function getArrivalDelay(waypoint) {
    if (
      waypoint.type === WaypointType.INBEETWEEN &&
      waypoint.prevMode === LegMode.PT &&
      waypoint.arrivalDelay !== 0
    ) {
      return " +" + waypoint.arrivalDelay;
    }
    return "";
  }

  return (
    <div>
      <TripElement decorationType={TripElementDecorationType.NONE}>
        <div>{getArrivalTime(waypoint)}</div>
        <span />
      </TripElement>
      <TripElement
        isLastElement={waypoint.type === WaypointType.LAST}
        decorationType={TripElementDecorationType.WAYPOINT}
      >
        <div>
          <span>{getTime(waypoint)} </span>
          <span>{getDelay(waypoint)}</span>
        </div>
        <span className={styles.waypointName}>{waypoint.name}</span>
      </TripElement>
    </div>
  );
};

const Turn = ({ sign, text }) => {
  return (
    <TripElement
      isLastElement={false}
      decorationType={TripElementDecorationType.NONE}
    >
      <span />
      <span>{text}</span>
    </TripElement>
  );
};

const LegDescription = ({ icon, onClick, children }) => {
  return (
    <TripElement
      isLastElement={false}
      decorationType={TripElementDecorationType.NONE}
    >
      <img src={icon} className={styles.legDescriptionIcon} />
      <div className={styles.legRowDescription}>
        <button
          onClick={e => onClick()}
          className={styles.tripDescriptionButton}
        >
          {children}
        </button>
      </div>
    </TripElement>
  );
};

const StopOnLeg = ({ stop }) => {
  function createDepartureTime(stop) {
    return (
      <div>
        <span>{moment(stop.departureTime).format("HH:mm")}</span>
        {stop.delay > 0 ? (
          <span className={styles.delay}> +{stop.delay}</span>
        ) : (
          ""
        )}
      </div>
    );
  }

  return (
    <TripElement
      isLastElement={false}
      decorationType={TripElementDecorationType.STOP_ON_LEG}
    >
      {createDepartureTime(stop)}
      <span>{stop.name}</span>
    </TripElement>
  );
};

class TripElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, isLastElement, decorationType } = this.props;
    return (
      <div className={styles.tripElement}>
        <div className={styles.tripElementLeftColumn}>{children[0]}</div>
        <div className={styles.tripElementContent}>
          <TripElementDecoration
            isLastElement={isLastElement}
            decorationType={decorationType}
          />
          <div className={styles.tripElementDetails}>{children[1]}</div>
        </div>
      </div>
    );
  }
}

const TripElementDecoration = ({ isLastElement, decorationType }) => {
  function getCircle(decorationType) {
    switch (decorationType) {
      case TripElementDecorationType.WAYPOINT:
        return <div className={styles.waypointCircle} />;
      case TripElementDecorationType.STOP_ON_LEG:
        return <div className={styles.stopOnLegCircle} />;
      default:
        return "";
    }
  }

  function getLine(isLastElement) {
    return isLastElement ? "" : <div className={styles.line} />;
  }

  return (
    <div className={styles.tripElementDecoration}>
      {getCircle(decorationType)}
      {getLine(isLastElement)}
    </div>
  );
};

const TripElementDecorationType = {
  WAYPOINT: 0,
  STOP_ON_LEG: 1,
  NONE: 2
};

export { Waypoint, LegDescription, StopOnLeg, Turn };
