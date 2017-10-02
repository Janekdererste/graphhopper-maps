import React from "react";
import Moment from "moment";
import Dispatcher from "../../data/Dispatcher.js";
import { RouteActionType } from "../../data/RouteStore.js";
import styles from "./RouteResultDisplay.css";

export default ({ routes }) => {
  return (
    <div>
      <h3>Result</h3>
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
      <div className={styles.timeContainer}>
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
    <div>
      {path.legs.map((leg, i) => {
        switch (leg.type) {
          case "walk":
            return <Walk key={i} leg={leg} />;
          case "pt":
            return <Pt key={i} leg={leg} />;
          default:
            return <label>Implement leg type: {leg.type}</label>;
        }
      })}
    </div>
  );
};

const Walk = ({ leg }) => {
  function getDistance(distance) {
    return Math.round(distance / 100) * 100;
  }

  function getStreetName(instructions) {
    let result = "somewhere";
    instructions.forEach(instruction => {
      if (instruction.street_name && instruction.street_name != "") {
        result = instruction.street_name;
      }
    });
    return result;
  }

  return (
    <div className={styles.leg}>
      <div className={styles.legInfo}>
        <label>{Moment(leg.departureTime).format("HH:mm")}</label>
        <label>{leg.type}</label>
      </div>
      <div className={styles.tripInfo}>
        <label>{getStreetName(leg.instructions)}</label>
        <label>
          {getDuration(leg.arrivalTime, leg.departureTime) +
            " min, " +
            getDistance(leg.distance)}m
        </label>
      </div>
    </div>
  );
};

const Pt = ({ leg }) => {
  return (
    <div className={styles.leg}>
      <div className={styles.legInfo}>
        <label>{Moment(leg.departureTime).format("HH:mm")}</label>
        <label>{leg.type}</label>
      </div>
      <div className={styles.tripInfo}>
        <label>{leg.stops[0].stop_name}</label>
        <label>
          {getDuration(leg.arrivalTime, leg.departureTime) +
            " min, " +
            leg.stops.length}{" "}
          Stops
        </label>
      </div>
    </div>
  );
};

function getDuration(arrival, departure) {
  return Moment(arrival).diff(Moment(departure), "minutes");
}
