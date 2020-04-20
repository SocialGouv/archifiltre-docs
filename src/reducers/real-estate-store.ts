import React from "react";
import root_reducer from "reducers/root-reducer";
import * as ObjectUtil from "util/object/object-util";
import { compose } from "util/function/function-util";

function makeStore(compiledRealEstate) {
  const initialState = compiledRealEstate.initialState;
  const flatApi = flattenApi(compiledRealEstate.api);
  const writerKey = [] as string[];
  const readerKey = [] as string[];

  for (const key in flatApi) {
    if (flatApi.hasOwnProperty(key)) {
      if (flatApi[key].reader) {
        readerKey.push(key);
      }
      if (flatApi[key].writer) {
        writerKey.push(key);
      }
    }
  }

  // tslint:disable-next-line:no-shadowed-variable
  class Store extends React.Component {
    private api;
    private getApi;
    private stateChangePending;
    private upcomingStateChange;
    constructor(props) {
      super(props);

      this.state = initialState();
      this.api = {};

      readerKey.forEach((key) => {
        this.api[key] = (...args) => flatApi[key](...args)(this.state);
      });

      writerKey.forEach((key) => {
        this.api[key] = (...args) => this.updateState(key, args);
      });

      this.api = unflattenApi(this.api);
      this.getApi = () => ({ ...this.api });
    }

    updateState(key, args) {
      /* We prevent multiple rerendering on a single call stack by chaining all the state modifications and updating the
        state only once every callstack */
      if (!this.stateChangePending) {
        this.stateChangePending = true;
        this.upcomingStateChange = (state) => state;
        setImmediate(() => {
          this.stateChangePending = false;
          this.setState(this.upcomingStateChange);
        });
      }
      // We chain all the state updates and calls them afterwards
      this.upcomingStateChange = compose(
        flatApi[key](...args),
        this.upcomingStateChange
      );
    }

    render() {
      // @ts-ignore
      return this.props.children(
        ObjectUtil.compose({ api: this.getApi() }, this.props)
      );
    }
  }

  // tslint:disable-next-line:no-shadowed-variable
  const ApiContext = React.createContext({});

  return {
    Store,
    ApiContext,
  };
}

const flattenApi = (api) => {
  const flatApi = {};
  for (const key1 in api) {
    if (api.hasOwnProperty(key1)) {
      for (const key2 in api[key1]) {
        if (api[key1].hasOwnProperty(key2)) {
          flatApi[key1 + "|" + key2] = api[key1][key2];
        }
      }
    }
  }
  return flatApi;
};

const unflattenApi = (flatApi) => {
  const api = {};
  for (const key in flatApi) {
    if (flatApi.hasOwnProperty(key)) {
      const split = key.split("|");
      if (api[split[0]] === undefined) {
        api[split[0]] = {};
      }
      api[split[0]][split[1]] = flatApi[key];
    }
  }
  return api;
};

export const { Store, ApiContext } = makeStore(root_reducer);
