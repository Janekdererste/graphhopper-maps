const prefix = "ID_";

class Dispatcher {
  constructor() {
    this._stores = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastId = 1;
    this._currentAction = undefined;
  }

  addStore(store) {
    let id = prefix + this._lastId++;
    this._stores[id] = store;
    return id;
  }

  removeStore(store) {
    if (this._stores[id]) {
      delete this._stores[id];
    }
  }

  dispatch(action) {
    this._isDispatching = true;
    this._startDispatching(action);
    try {
      for (let id in this._stores) {
        this._callStore(id, action);
      }
    } finally {
      this._stopDispatching();
    }
  }

  _callStore(id, action) {
    this._isPending[id] = true;
    this._stores[id](action);
    this._isHandled[id] = true;
  }

  _startDispatching(action) {
    for (let id in this._stores) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._currentAction = action;
    this._isDispatching = true;
  }

  _stopDispatching() {
    delete this._currentAction;
    this._isDispatching = false;
  }
}
export default new Dispatcher();
