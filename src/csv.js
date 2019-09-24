import { List } from "immutable";
import dateFormat from "dateformat";

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

export const epochToFormattedUtcDateString = a => dateFormat(a, "dd/mm/yyyy");
