import React from "react";
import moment from "moment";
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
        value={search.from.toString()}
        label="From"
        actionType={SearchActionType.FROM}
        onChange={onChange}
      />
      <TextInput
        value={search.to.toString()}
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
        <div>
          <TimeInput onChange={onChange} search={search} />
          <DateInput onChange={onChange} search={search} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const TimeInput = ({ onChange, search }) => {
  return (
    <input
      type="time"
      className={styles.timeInput}
      value={search.departureDateTime.format("hh:mm")}
      onChange={e =>
        onChange({
          type: SearchActionType.DEPARTURE_TIME,
          value: e.target.value
        })}
    />
  );
};

const DateInput = ({ onChange, search }) => {
  return (
    <input
      className={styles.timeInput}
      type="date"
      value={search.departureDateTime.format("YYYY-MM-DD")}
      onChange={e =>
        onChange({
          type: SearchActionType.DEPARTURE_DATE,
          value: e.target.value
        })}
    />
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
