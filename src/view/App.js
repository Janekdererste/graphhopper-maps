import React from "react";
import Sidebar from "./Sidebar.js";
import Map from "./Map.js";
import SearchStore from "../data/SearchStore.js";

import styles from "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.searchStore = new SearchStore();
    this.state = {
      paths: undefined
    };
  }

  handleSearch() {
    this.searchStore.search(
      paths => {
        this.setState({ paths: paths });
      },
      error => {
        this.setState({ result: error.message });
      }
    );
  }

  render() {
    return (
      <div className={styles.appWrapper}>
        <div className={styles.sidebar}>
          <Sidebar
            paths={this.state.paths}
            onSearch={() => this.handleSearch()}
          />
        </div>
        <div className={styles.map}>
          <Map paths={this.state.paths} />
        </div>
      </div>
    );
  }
}
