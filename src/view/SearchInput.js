import React from "react";
import { SearchActionType, TimeOption } from "../data/SearchStore.js";
import styles from "./SearchInput.css";

export default ({ search, onSearchChange }) => {
  return (
    <div className={styles.searchInput}>
      <LocationInput search={search} onChange={onSearchChange} />
      <TimeSelect search={search} onChange={onSearchChange} />
      <Options search={search} onChange={onSearchChange} />
    </div>
  );
};

const LocationInput = ({ search, onChange }) => {
  return (
    <div className={styles.locationInput}>
      <div className={styles.locationInputField}>
        <label>From</label>
        <input
          type="text"
          value={search.from}
          onChange={e =>
            onChange({ type: SearchActionType.FROM, value: e.target.value })}
        />
      </div>
      <div className={styles.locationInputField}>
        <label>To</label>
        <input
          type="text"
          value={search.to}
          onChange={e =>
            onChange({ type: SearchActionType.TO, value: e.target.value })}
        />
      </div>
    </div>
  );
};

const TimeSelect = ({ onChange, search }) => {
  return (
    <div className={styles.timeSelect}>
      <div className={styles.locationInputField}>
        <label>Time</label>
        <select
          value={search.timeOption}
          onChange={e =>
            onChange({
              type: SearchActionType.TIME_OPTION,
              value: e.target.value
            })}
        >
          <option value={TimeOption.NOW}>Leave Now</option>
          <option value={TimeOption.DEPARTURE}>Departure at</option>
          <option value={TimeOption.ARRIVAL}>Arrival at</option>
        </select>
      </div>
      {search.timeOption != TimeOption.NOW ? (
        <TimeInput onChange={onChange} search={search} />
      ) : (
        ""
      )}
    </div>
  );
};

const TimeInput = ({ onChange, search }) => {
  return (
    <input
      type="text"
      className={styles.timeInput}
      value={search.time}
      onChange={e =>
        onChange({
          type: SearchActionType.DEPARTURE_TIME,
          value: e.target.value
        })}
    />
  );
};

const Options = ({ search, onChange }) => {
  return null;
};
