import React from "react";
import styles from "./SecondaryText.css";

export default function({ children }) {
  return <span className={styles.secondaryText}>{children}</span>;
}
