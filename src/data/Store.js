export default class Store {
  constructor(dispatcher) {
    this._dispatchToken = dispatcher.addStore(action => this.dispatch(action));
    this._handlers = [];
    this._state = this.getInitialState();
  }

  getInitialState() {
    throw "getInitialState must be overritten";
  }

  getState() {
    return this._state;
  }

  reduce(state, action) {
    throw "reduce action must be overritten";
  }

  dispatch(action) {
    const startingState = this._state;
    const endingState = this.reduce(startingState, action);

    if (!this.areEqual(startingState, endingState)) {
      this._state = endingState;
      this._changed();
    }
  }

  registerChangeHandler(handler) {
    this._handlers.push(handler);
  }

  unregisterChangeHandler(handler) {
    let index = this._handlers.indexOf(handler);
    if (index != -1) {
      this._handlers.splice(index, 1);
    }
  }

  areEqual(one, two) {
    return one === two;
  }

  _changed() {
    this._handlers.forEach(handler => handler());
  }
}
