import React from "react";
import moment from "moment";
import styles from "./TripElement.css";

const Waypoint = ({ time, timeClassName = "", name, isLastLeg = false }) => {
  return (
    <TripElement
      isLastElement={isLastLeg}
      decorationType={TripElementDecorationType.WAYPOINT}
    >
      <span className={timeClassName}>{time}</span>
      <span className={styles.waypointName}>{name}</span>
    </TripElement>
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

const LegDescription = ({ type, onClick, children }) => {
  return (
    <TripElement
      isLastElement={false}
      decorationType={TripElementDecorationType.NONE}
    >
      <span>{type}</span>
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

const StopOnLeg = ({ detail }) => {
  let time, className;
  if (detail.realtime) {
    time = moment(detail.realtime).format("HH:mm");
    className = styles.stopOnLegDelayedTime;
  } else {
    time = moment(detail.additional).format("HH:mm");
    className = styles.stopOnLegTime;
  }

  return (
    <TripElement
      isLastElement={false}
      decorationType={TripElementDecorationType.STOP_ON_LEG}
    >
      <span className={className}>{time}</span>
      <span>{detail.main}</span>
    </TripElement>
  );
};

class TripElement extends React.Component {
  constructor(props) {
    super(props);
    this._validateProps(props);
  }

  _validateProps(props) {
    if (!props.children && props.children.length != 2) {
      throw Error(
        "TripElement requires two child elements 0=leftColumn, 1=Description (e.g. Stop name"
      );
    }
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
