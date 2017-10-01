import React from "react";
import styles from "./RouteResultDisplay.css";

export default ({ path }) => {
  return (
    <div>
      <h3>Result</h3>
      <label>distance: {path.distance}</label>
      <label>time: {path.time} </label>
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
  return (
    <div className={styles.leg}>
      <label>{leg.type}</label>
      <label>{leg.departureTime}</label>
      <label>distance: {leg.distance}m</label>
    </div>
  );
};

const Pt = ({ leg }) => {
  return (
    <div className={styles.leg}>
      <label>{leg.type}</label>
      <label>{leg.departureTime}</label>
      <label>From: {leg.departureLocation}</label>
      <label>Duration: {leg.travelTime}</label>
      <label>distance: {leg.distance}m</label>
      <label>Stops: </label>
      <ul>
        {leg.stops.map((stop, i) => {
          return <li key={i}>{stop.stop_name}</li>;
        })}
      </ul>
    </div>
  );
};
