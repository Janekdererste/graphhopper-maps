import React from "react";
import styles from "./Sidebar.css";
import SearchInput from "./SearchInput.js";
import RouteResultDisplay from "./RouteResultDisplay.js";
import { SearchActionType, TimeOption } from "../data/SearchStore.js";
import { PathActionType } from "../data/RouteStore.js";

export default ({ routes, search, onSearchChange, onSearchClick }) => {
  return (
    <div className={styles.sidebar}>
      <SearchInput search={search} onSearchChange={onSearchChange} />
      <p>{getStatusText(routes)}</p>
      {routes.paths ? <RouteResultDisplay path={routes.paths[0]} /> : ""}
    </div>
  );
};

function getStatusText(routes) {
  if (routes.isFetching) {
    return "loading...";
  }
  if (!routes.isLastQuerySuccess) {
    return "error during last request";
  }
}
