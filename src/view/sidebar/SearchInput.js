import React from "react";
import { SearchActionType, TimeOption } from "../../data/SearchStore.js";
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
      <TextInput
        value={search.from}
        label="From"
        actionType={SearchActionType.FROM}
        onChange={onChange}
      />
      <TextInput
        value={search.to}
        label="To"
        actionType={SearchActionType.TO}
        onChange={onChange}
      />
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
    <div>
      <input
        className={styles.timeInput}
        type="datetime-local"
        value={search.departureTime.toISOString().substring(0, 16)}
        onChange={e =>
          onChange({
            type: SearchActionType.DEPARTURE_TIME,
            value: new Date(e.target.value)
          })}
      />
    </div>
  );
};

const Options = ({ search, onChange }) => {
  return (
    <div>
      <button
        className={styles.optionsButton}
        onClick={e =>
          onChange({
            type: SearchActionType.IS_SHOWING_OPTIONS,
            value: !search.isShowingOptions
          })}
      >
        Options
      </button>
      {search.isShowingOptions ? (
        <div>
          <TextInput
            value={search.weighting}
            label="Weighting"
            actionType={SearchActionType.WEIGHTING}
            onChange={onChange}
          />
          <TextInput
            value={search.maxWalkDistance}
            label="Max. Walking Distance"
            actionType={SearchActionType.MAX_WALK_DISTANCE}
            onChange={onChange}
          />
          <TextInput
            value={search.limitSolutions}
            label="# Alternatives"
            actionType={SearchActionType.LIMIT_SOLUTIONS}
            onChange={onChange}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const TextInput = ({ value, label, actionType, onChange }) => {
  return (
    <div className={styles.locationInputField}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange({ type: actionType, value: e.target.value })}
      />
    </div>
  );
};
