import React from "react";
import moment from "moment";
import { SearchActionType, TimeOption } from "../../data/SearchStore.js";
import SecondaryText from "../components/SecondaryText.js";
import {
  TextInput,
  TimeInput,
  DateInput,
  Select
} from "../components/Inputs.js";
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
  const options = [
    { value: TimeOption.NOW, label: "Leave Now" },
    { value: TimeOption.DEPARTURE, label: "Departure at" },
    { value: TimeOption.ARRIVAL, label: "Arrival at" }
  ];
  return (
    <div className={styles.timeSelect}>
      <Select
        value={search.timeOption}
        label={"Time"}
        options={options}
        onChange={onChange}
        actionType={SearchActionType.TIME_OPTION}
      />
      {search.timeOption != TimeOption.NOW ? (
        <div className={styles.dateTimeContainer}>
          <TimeInput
            value={search.departureDateTime.format("HH:mm")}
            onChange={onChange}
            actionType={SearchActionType.DEPARTURE_TIME}
          />
          <DateInput
            value={search.departureDateTime.format("YYYY-MM-DD")}
            onChange={onChange}
            actionType={SearchActionType.DEPARTURE_DATE}
          />
        </div>
      ) : (
        ""
      )}
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
          })
        }
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
