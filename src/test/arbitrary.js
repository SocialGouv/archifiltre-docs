import { Map, List, Set } from "immutable";

import { generateRandomString } from "random-gen";

import colors from "colors/safe";

const randNat = a => Math.round(Math.random() * a);

const strange = 0.1;

export const natural = () => {
  if (Math.random() <= strange) {
    return 0;
  } else {
    return randNat(4000);
  }
};
export const bool = () => Math.random() >= 0.5;
export const string = () => {
  if (Math.random() <= strange) {
    return "";
  } else {
    return generateRandomString(randNat(40));
  }
};
export const index = () => {
  if (Math.random() <= strange) {
    return 0;
  } else {
    return randNat(10);
  }
};

export const arrayWithIndex = index => arbitrary => {
  let arr = [];
  const nb = index();
  for (let i = nb - 1; i >= 0; i--) {
    arr.push(arbitrary());
  }
  return arr;
};

export const array = arrayWithIndex(index);

export const immutableList = arbitrary => List(array(arbitrary));

export const immutableMap = (arbitraryKey, arbitraryValue) => {
  let map = Map();
  const nb = index();
  for (let i = nb - 1; i >= 0; i--) {
    map = map.set(arbitraryKey(), arbitraryValue());
  }
  return map;
};

export const immutableSet = arbitrary => Set(array(arbitrary));

export const nullable = a => (Math.random() <= 0.25 ? null : a());
