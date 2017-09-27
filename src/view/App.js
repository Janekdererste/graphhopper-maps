import React from "react";
import Sidebar from "./Sidebar.js";
import Map from "./Map.js";
import PathStore, { PathActionType } from "../data/PathStore.js";
import SearchStore from "../data/SearchStore.js";

import styles from "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: new SearchStore()
    };
    this.pathStore = new PathStore(this.state.search)
    this.state.paths = this.pathStore.state;
  }

  handleSearchChange(action) {
    const newSearch = SearchStore.updateSearch(this.state.search, action);
    this.pathStore.search = newSearch;
    this.setState({ search: newSearch });
  }

  handleSearchClick() {
    const newPaths = this.pathStore.handleAction( {
      type: PathActionType.REQUEST_PATH
    });
    this.setState({paths: newPaths});
    this.pathStore.requestPath(
      result => {
        const resultPaths = this.pathStore.handleAction( {
          type: PathActionType.RECEIVE_PATH,
          value: result
        });
        this.setState({ paths: resultPaths });
      },
      error => {
        console.log(error.message);
        const resultPaths = this.pathStore.handleAction({
          type: PathActionType.RECEIVE_PATH,
          value: undefined
        });
        this.setState({ paths: resultPaths });
      }
    );
  }

  render() {
    return (
      <div className={styles.appWrapper}>
        <div className={styles.sidebar}>
          <Sidebar
            pathStore={this.state.paths}
            searchStore={this.state.search}
            onSearchChange={action => this.handleSearchChange(action)}
            onSearchClick={() => this.handleSearchClick()}
          />
        </div>
        <div className={styles.map}>
          <Map pathStore={this.state.paths} />
        </div>
      </div>
    );
  }
}
