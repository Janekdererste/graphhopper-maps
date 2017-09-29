import React from "react";
import Sidebar from "./Sidebar.js";
import Map from "./Map.js";
import PathStore, { RouteActionType } from "../data/RouteStore.js";
import SearchStore from "../data/SearchStore.js";
import Dispatcher from "../data/Dispatcher.js";

import styles from "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.searchStore = new SearchStore(Dispatcher);
    this.searchStore.registerChangeHandler(() =>
      this.handleSearchStoreChanged()
    );
    this.routeStore = new PathStore(Dispatcher, this.searchStore.getState());
    this.routeStore.registerChangeHandler(() => this.handleRouteStoreChanged());

    this.state = {
      search: this.searchStore.getState(),
      routes: this.routeStore.getState()
    };
  }

  handleSearchStoreChanged() {
    this.setState({ search: this.searchStore.getState() });
  }

  handleRouteStoreChanged() {
    this.setState({ routes: this.routeStore.getState() });
  }

  handleSearchChange(action) {
    Dispatcher.dispatch(action);
  }

  handleSearchClick() {
    Dispatcher.dispatch({ type: RouteActionType.REQUEST_PATH });
  }

  render() {
    return (
      <div className={styles.appWrapper}>
        <div className={styles.sidebar}>
          <Sidebar
            routes={this.state.routes}
            search={this.state.search}
            onSearchChange={action => this.handleSearchChange(action)}
            onSearchClick={() => this.handleSearchClick()}
          />
        </div>
        <div className={styles.map}>
          <Map routes={this.state.routes} />
        </div>
      </div>
    );
  }
}
