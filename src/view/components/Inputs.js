import React from "react";
import styles from "./Inputs.css";

import SecondaryText from "./SecondaryText.js";

const TextInput = props => {
  return Input(Object.assign({}, props, { type: "text" }));
};

const TimeInput = props => {
  return Input(Object.assign({}, props, { type: "time" }));
};

const DateInput = props => {
  return Input(Object.assign({}, props, { type: "date" }));
};

const Select = ({ value, label = "", options, onChange, actionType }) => {
  return (
    <div className={styles.inputContainer}>
      <SecondaryText>{label}</SecondaryText>
      <select
        className={styles.select}
        value={value}
        onChange={e => onChange({ type: actionType, value: e.target.value })}
      >
        {options.map((option, i) => {
          return (
            <option value={option.value} key={i}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const Input = ({ value, label = "", type, actionType, onChange }) => {
  return (
    <div className={styles.inputContainer}>
      <SecondaryText>{label}</SecondaryText>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={e => onChange({ type: actionType, value: e.target.value })}
      />
    </div>
  );
};

export { TextInput, TimeInput, DateInput, Select };
