import { List } from "immutable";

import * as Arbitrary from "test/arbitrary";
import * as Loop from "test/loop";

export const arbitrary = () =>
  Arbitrary.immutableList(() => Arbitrary.immutableList(Arbitrary.string));

const cell_separator = ";";
const line_separator = "\n";

const str2Cell = a => `"${a}"`;
export const list2Line = a => {
  return a.map(str2Cell).join(cell_separator) + line_separator;
};
export const toStr = a => {
  return a.map(list2Line).join("");
};

export const fromStr = a => {
  if (a === "") {
    return List();
  }
  a = a
    .split(line_separator)
    .slice(0, -1)
    .map(a => a + line_separator);
  return List(a).map(line2List);
};

export const line2List = a => {
  const re = new RegExp(`^"|"${cell_separator}"|"${line_separator}$`);
  return List(a.split(re).slice(1, -1));
};

export const leftPadInt = (pad, num) => {
  const zero_string = new Array(pad).fill("0").join("");
  const num_len = num.toString().length;

  return (zero_string + num).slice(-Math.max(pad, num_len));
};

export const epochToFormatedUtcDateString = a => {
  const date = new Date(a);
  const year = date.getUTCFullYear();
  const zero_based_month = date.getUTCMonth();
  const day_of_the_month = date.getUTCDate();

  return (
    leftPadInt(2, day_of_the_month) +
    "/" +
    leftPadInt(2, zero_based_month + 1) +
    "/" +
    leftPadInt(4, year)
  );
};
