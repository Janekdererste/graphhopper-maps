import React from "react";
import styles from "./Sidebar.css";
import { SearchActionType } from "../data/SearchStore.js";
import { PathActionType } from "../data/PathStore.js";

const PathDisplay = ({ path }) => {
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

const Search = ({ searchStore, onChange, onClick }) => {
  return (
    <div className={styles.search}>
      <div>
        <label>From: </label>
        <input
          type="text"
          value={searchStore.from}
          onChange={e =>
            onChange({ type: SearchActionType.FROM, value: e.target.value })}
        />
      </div>
      <div>
        <label>To: </label>
        <input
          type="text"
          value={searchStore.to}
          onChange={e =>
            onChange({ type: SearchActionType.TO, value: e.target.value })}
        />
      </div>
      <div>
        <label>Time: </label>
        <input
          type="text"
          value={searchStore.departureTime}
          onChange={e =>
            onChange({
              type: SearchActionType.DEPARTURE_TIME,
              value: e.target.value
            })}
        />
      </div>
      <div>
        <label>Walking distance: </label>
        <input
          type="text"
          value={searchStore.maxWalkDistance}
          onChange={e =>
            onChange({
              type: SearchActionType.MAX_WALK_DISTANCE,
              value: e.target.value
            })}
        />
      </div>
      <div>
        <button onClick={e => onClick()}>Search</button>
      </div>
    </div>
  );
};

export default ({ pathStore, searchStore, onSearchChange, onSearchClick }) => {
  return (
    <div className={styles.sidebar}>
      <Search
        searchStore={searchStore}
        onChange={onSearchChange}
        onClick={onSearchClick}
      />
      <p>{pathStore.isFetching ? "loading..." : "not loading!"}</p>

      {pathStore.paths ? <PathDisplay path={pathStore.paths[0]} /> : ""}
    </div>
  );
};
