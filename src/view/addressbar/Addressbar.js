import React from "react";

import { CreateQuery } from "../../data/Query.js";
import { SearchActionType } from "../../data/SearchStore.js";

export default class Addressbar extends React.Component {
  constructor(props) {
    super(props);
    this._validateProps(props);
    this._setSearchParametersFromAddressbarIfNecessary();
  }

  _validateProps({ search, onHistoryChange }) {
    if (!search || !onHistoryChange) {
      throw Error(
        "Addressbar: search and onHistoryChanged callback must be provided"
      );
    }
  }

  _setSearchParametersFromAddressbarIfNecessary() {
    let currentURL = new URL(window.location.href);
    if (currentURL.pathname && currentURL.pathname === "/route") {
      const action = {
        type: SearchActionType.SEARCH_URL_CHANGED,
        value: currentURL.searchParams
      };
      this.props.onHistoryChange(action);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(props) {
    let currentURL = new URL(window.location.href);
    let query = CreateQuery(props.search);
    window.history.replaceState({ name: "last state" }, "", query);
  }

  render() {
    return null;
  }
}
