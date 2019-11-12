import React from "react";
import root_reducer from "reducers/root-reducer";
import * as ObjectUtil from "util/object-util.ts";
import { compose } from "../util/function-util";

function makeStore(compiled_real_estate) {
  const initialState = compiled_real_estate.initialState;
  const flat_api = flattenApi(compiled_real_estate.api);
  const writer_key = [];
  const reader_key = [];

  for (const key in flat_api) {
    if (flat_api[key].reader) {
      reader_key.push(key);
    }
    if (flat_api[key].writer) {
      writer_key.push(key);
    }
  }

  class Store extends React.Component {
    constructor(props) {
      super(props);

      this.state = initialState();

      this.api = {};

      reader_key.forEach(key => {
        this.api[key] = (...args) => flat_api[key](...args)(this.state);
      });

      writer_key.forEach(key => {
        this.api[key] = (...args) => this.updateState(key, args);
      });

      this.api = unflattenApi(this.api);

      this.getApi = () => Object.assign({}, this.api);
    }

    updateState(key, args) {
      /* We prevent multiple rerendering on a single call stack by chaining all the state modifications and updating the
        state only once every callstack */
      if (!this.stateChangePending) {
        this.stateChangePending = true;
        this.upcomingStateChange = state => state;
        setImmediate(() => {
          this.stateChangePending = false;
          this.setState(this.upcomingStateChange);
        });
      }
      // We chain all the state updates and calls them afterwards
      this.upcomingStateChange = compose(
        flat_api[key](...args),
        this.upcomingStateChange
      );
    }

    render() {
      return this.props.children(
        ObjectUtil.compose({ api: this.getApi() }, this.props)
      );
    }
  }

  const ApiContext = React.createContext({});

  return {
    Store,
    ApiContext
  };
}

const flattenApi = api => {
  const flat_api = {};
  for (const key1 in api) {
    for (const key2 in api[key1]) {
      flat_api[key1 + "|" + key2] = api[key1][key2];
    }
  }
  return flat_api;
};

const unflattenApi = flat_api => {
  const api = {};
  for (const key in flat_api) {
    const split = key.split("|");
    if (api[split[0]] === undefined) {
      api[split[0]] = {};
    }
    api[split[0]][split[1]] = flat_api[key];
  }
  return api;
};

export const { Store, ApiContext } = makeStore(root_reducer);
