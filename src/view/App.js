import React from "react";
import Sidebar from "./Sidebar.js";
import Map from "./Map.js";

import styles from "./App.css";

export default () => {
  return (
    <div className={styles.appWrapper}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.map}>
        <Map className={styles.map} />
      </div>
    </div>
  );
};
