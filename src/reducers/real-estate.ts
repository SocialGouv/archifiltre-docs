import * as ObjectUtil from "util/object/object-util";

export const create = (state) => {
  const property_name = state.property_name;
  const get = (s) => s[property_name];
  const set = (a, s) => ObjectUtil.compose({ [property_name]: a }, s);

  const initialState = (s) => set(state.initialState(), s);

  const reader = {};
  for (const key in state.reader) {
    if (state.reader.hasOwnProperty(key)) {
      updateGetAndSet(get, set, property_name, key, state.reader, reader);
    }
  }
  const writer = {};
  for (const key in state.writer) {
    if (state.writer.hasOwnProperty(key)) {
      updateGetAndSet(get, set, property_name, key, state.writer, writer);
    }
  }

  return {
    initialState,
    reader,
    writer,
  };
};

const updateGetAndSet = (get, set, propertyName, oldKey, oldObj, newObj) => {
  let newKey = oldKey;
  let update = (a, b) => [a].concat(b);

  if (oldObj[oldKey].get === undefined) {
    newKey = propertyName + "|" + oldKey;
    update = (a) => [a];
  }

  newObj[newKey] = (...args) => oldObj[oldKey](...args);
  newObj[newKey].get = update(get, oldObj[oldKey].get);
  newObj[newKey].set = update(set, oldObj[oldKey].set);
};

export const empty = () => {
  const initialState = (s) => s;
  const reader = {};
  const writer = {};
  return {
    initialState,
    reader,
    writer,
  };
};

export const compose = (a, b) => {
  const initialState = (s) => a.initialState(b.initialState(s));
  const reader = ObjectUtil.compose(a.reader, b.reader);
  const writer = ObjectUtil.compose(a.writer, b.writer);
  return {
    initialState,
    reader,
    writer,
  };
};

const compileGet = (get) => {
  if (get.length === 0) {
    return (s) => s;
  } else {
    return (s) => compileGet(get.slice(1))(get[0](s));
  }
};

const compileSet = (get, set) => {
  if (set.length === 0) {
    return (a) => a;
  } else {
    return (a, s) =>
      set[0](compileSet(get.slice(1), set.slice(1))(a, get[0](s)), s);
  }
};

const cache = (f) => {
  const equal = (firstState, secondState) => firstState === secondState;
  let lastArgs = [Symbol()];
  let lastState = Symbol();
  let lastAns;
  return (...args) => (state) => {
    const sameArgs = args.reduce(
      (acc, val, ind) => acc && val === lastArgs[ind],
      true
    );
    if (sameArgs === false || !equal(lastState, state)) {
      lastArgs = args;
      lastState = state;
      lastAns = f(...args)(state);
    }
    return lastAns;
  };
};

export const compile = (realEstate) => {
  const initialState = () => realEstate.initialState({});
  const api = {};

  for (const key in realEstate.reader) {
    if (realEstate.reader.hasOwnProperty(key)) {
      const f = realEstate.reader[key];
      const get = compileGet(f.get);
      const cachedF = cache(f);
      api[key] = (...args) => (state) => cachedF(...args)(get(state));
      delete api[key].get;
      delete api[key].set;
      api[key].reader = true;
    }
  }

  for (const key in realEstate.writer) {
    if (realEstate.writer.hasOwnProperty(key)) {
      const f = realEstate.writer[key];
      const get = compileGet(f.get);
      const set = compileSet(f.get, f.set);
      api[key] = (...args) => (state) => set(f(...args)(get(state)), state);
      delete api[key].get;
      delete api[key].set;
      api[key].writer = true;
    }
  }

  for (const key in api) {
    if (api.hasOwnProperty(key)) {
      const split = key.split("|");

      if (api[split[0]] === undefined) {
        api[split[0]] = {};
      }
      api[split[0]][split[1]] = api[key];
      delete api[key];
    }
  }

  return {
    initialState,
    api,
  };
};
