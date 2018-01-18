import React from "react";
import moment from "moment";
import { WaypointType } from "../../data/Waypoint.js";
import { LegMode } from "../../data/Leg.js";

import SecondaryText from "../components/SecondaryText.js";
import styles from "./TripElement.css";

const Waypoint = ({ name, time, delay, isPossible = true, isLast = false }) => {
  const waypointNameClassName = isPossible
    ? styles.waypointName
    : styles.waypointNameImpossible;
  return (
    <TripElement
      decorationType={TripElementDecorationType.WAYPOINT}
      isLastElement={isLast}
    >
      <TimeWithDelay time={time} delay={delay} />
      <div className={waypointNameClassName}>
        <span>{name}</span>
      </div>
    </TripElement>
  );
};

const Arrival = ({ time, delay }) => {
  return (
    <TripElement decorationType={TripElementDecorationType.NONE}>
      <div className={styles.arrivalTime}>
        <TimeWithDelay time={time} delay={delay} />
      </div>
      <span />
    </TripElement>
  );
};

const TimeWithDelay = ({ time, delay }) => {
  function getDelay(delay) {
    if (delay) {
      let prefix = "";
      let style = styles.negativeDelay;
      if (delay > 0) {
        prefix = "+";
        style = styles.delay;
      }
      return <span className={style}> {prefix + delay}</span>;
    }
  }
  return (
    <div className={styles.TimeWithDelay}>
      <span>{time}</span>
      {getDelay(delay)}
    </div>
  );
};

const Turn = ({ sign, text }) => {
  return (
    <TripElement decorationType={TripElementDecorationType.NONE}>
      <span />
      <span>{text}</span>
    </TripElement>
  );
};

const LegDescription = ({ icon, onClick, children }) => {
  return (
    <TripElement decorationType={TripElementDecorationType.NONE}>
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

const StopOnLeg = ({ name, time, delay }) => {
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
    <TripElement decorationType={TripElementDecorationType.STOP_ON_LEG}>
      <TimeWithDelay time={time} delay={delay} />
      <span>{name}</span>
    </TripElement>
  );
};

const Padding = () => {
  return (
    <TripElement decorationType={TripElementDecorationType.NONE}>
      <span className={styles.padding} />
      <span />
    </TripElement>
  );
};

class TripElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, isLastElement = false, decorationType } = this.props;
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

export { Waypoint, Arrival, LegDescription, StopOnLeg, Turn, Padding };
