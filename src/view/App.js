import React from "react";
import Sidebar from "./sidebar/Sidebar.js";
import Map from "./map/Map.js";
import Addressbar from "./addressbar/Addressbar.js";
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
    this.routeStore = new PathStore(Dispatcher, this.searchStore);
    this.routeStore.registerChangeHandler(() => this.handleRouteStoreChanged());

    this.state = {
      search: this.searchStore.getState(),
      routes: this.routeStore.getState()
    };
  }

  componentDidMount() {
    Dispatcher.dispatch({ type: RouteActionType.REQUEST_PATH });
  }

  handleSearchStoreChanged() {
    this.setState({ search: this.searchStore.getState() });
  }

  handleRouteStoreChanged() {
    this.setState({ routes: this.routeStore.getState() });
  }

  handleHistoryChanged(action) {
    Dispatcher.dispatch(action);
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
        <Addressbar
          search={this.state.search}
          onHistoryChange={action => this.handleHistoryChanged(action)}
        />
        <div className={styles.sidebar}>
          <Sidebar
            routes={this.state.routes}
            search={this.state.search}
            onSearchChange={action => this.handleSearchChange(action)}
            onSearchClick={() => this.handleSearchClick()}
          />
        </div>
        <div className={styles.map}>
          <Map routes={this.state.routes} search={this.state.search} />
        </div>
      </div>
    );
  }
}
