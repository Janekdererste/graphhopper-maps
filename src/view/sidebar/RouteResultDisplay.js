import React from "react";
import Moment from "moment";
import Dispatcher from "../../data/Dispatcher.js";
import { RouteActionType } from "../../data/RouteStore.js";
import styles from "./RouteResultDisplay.css";

export default ({ routes }) => {
  return (
    <div className={styles.routeResultDisplay}>
      {routes.paths.map((path, i) => {
        return (
          <Route
            key={i}
            path={path}
            selectedIndex={routes.selectedRouteIndex}
            index={i}
          />
        );
      })}
    </div>
  );
};

const Route = ({ path, selectedIndex, index }) => {
  const departureTime = Moment(path.legs[0].departureTime);
  const arrivalTime = Moment(path.legs[path.legs.length - 1].arrivalTime);

  function getTimeLabel() {
    let depLabel = departureTime.format("HH:mm");
    let arrLabel = arrivalTime.format("HH:mm");
    return depLabel + " -- " + arrLabel;
  }

  function getDuration() {
    return arrivalTime.diff(departureTime, "minutes");
  }

  return (
    <div
      className={styles.route}
      onClick={e =>
        Dispatcher.dispatch({
          type: RouteActionType.SELECTED_ROUTE_INDEX,
          value: index
        })}
    >
      <div className={styles.routeTimeContainer}>
        <label>{getTimeLabel()}</label>
        <label>{getDuration()} min</label>
      </div>
      <label>Transfers {path.transfers}</label>
      {selectedIndex === index ? <RouteDetails path={path} /> : ""}
    </div>
  );
};

const RouteDetails = ({ path }) => {
  return (
    <div className={styles.routeDetails}>
      {path.legs.map((leg, i) => {
        switch (leg.type) {
          case "walk":
            return (
              <Walk key={i} leg={leg} isLastLeg={i === path.legs.length - 1} />
            );
          case "pt":
            return <Pt key={i} leg={leg} />;
          default:
            return <label>Implement leg type: {leg.type}</label>;
        }
      })}
    </div>
  );
};

const Waypoint = ({ time, label, isLastLeg }) => {
  return (
    <div className={styles.legRow}>
      <div className={styles.legRowLeftColumnContainer}>
        <span className={styles.legRowLeftColumn}>{time}</span>
      </div>
      <div className={styles.legRowDetails}>
        <div className={styles.legDecoration}>
          <div className={styles.waypointCircle} />
          {isLastLeg ? "" : <div className={styles.line} />}
        </div>
        <div className={styles.waypointLabel}>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

const Description = ({ type, description }) => {
  return (
    <div className={styles.legRow}>
      <div className={styles.legRowLeftColumnContainer}>
        <span className={styles.legRowLeftColumn}>{type}</span>
      </div>
      <div className={styles.legRowDetails}>
        <div className={styles.legDecoration}>
          <div className={styles.line} />
        </div>
        <div className={styles.legRowDescription}>{description}</div>
      </div>
    </div>
  );
};

const Walk = ({ leg, isLastLeg }) => {
  function roundDistance(distance) {
    return Math.round(distance / 100) * 100;
  }

  function findFirstStreetName(instructions) {
    let instruction = instructions.find(instruction => {
      return instruction.street_name && instruction.street_name != "";
    });
    return instruction ? instruction.street_name : "somewhere";
  }

  function findLastStreetName(instructions) {
    let result = "somewhere";

    for (let i = instructions.length - 1; i >= 0; i--) {
      let instruction = instructions[i];
      if (instruction.street_name && instruction.street_name != "") {
        result = instruction.street_name;
        break;
      }
    }
    return result;
  }

  return (
    <div className={styles.leg}>
      <Waypoint
        time={Moment(leg.departureTime).format("HH:mm")}
        label={findFirstStreetName(leg.instructions)}
        isLastLeg={false}
      />
      <Description
        type={leg.type}
        description={roundDistance(leg.distance) + "m"}
      />
      {isLastLeg ? (
        <Waypoint
          time={Moment(leg.arrivalTime).format("HH:mm")}
          label={findLastStreetName(leg.instructions)}
          isLastLeg={true}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const Pt = ({ leg }) => {
  return (
    <div className={styles.leg}>
      <Waypoint
        time={Moment(leg.departureTime).format("HH:mm")}
        label={leg.stops[0].stop_name}
      />
      <Description
        type={leg.type}
        description={
          getDuration(leg.arrivalTime, leg.departureTime) +
          " min, " +
          leg.stops.length +
          " Stops"
        }
      />
    </div>
  );
};

function getDuration(arrival, departure) {
  return Moment(arrival).diff(Moment(departure), "minutes");
}
