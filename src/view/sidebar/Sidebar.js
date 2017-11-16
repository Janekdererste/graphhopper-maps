import React from "react";
import styles from "./Sidebar.css";
import SearchInput from "./SearchInput.js";
import TripDisplay from "./TripDisplay.js";
import { SearchActionType, TimeOption } from "../../data/SearchStore.js";
import { PathActionType } from "../../data/RouteStore.js";

export default ({ routes, search, onSearchChange, onSearchClick }) => {
  function getSidebarContent(routes) {
    if (routes.isFetching) {
      return <Spinner />;
    }
    if (routes.isLastQuerySuccess && routes.paths) {
      return <TripDisplay trips={routes} />;
    }
    return <RequestError />;
  }

  return (
    <div className={styles.sidebar}>
      <SearchInput search={search} onSearchChange={onSearchChange} />
      {getSidebarContent(routes)}
    </div>
  );
};

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div className={styles.rect1} />
        <div className={styles.rect2} />
        <div className={styles.rect3} />
        <div className={styles.rect4} />
        <div className={styles.rect5} />
      </div>
    </div>
  );
};

const RequestError = () => {
  return (
    <div className={styles.spinnerContainer}>
      <span>No route for selected Parameters.</span>
    </div>
  );
};
