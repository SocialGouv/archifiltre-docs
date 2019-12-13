import { FileType, getFileTypeFromFileName } from "./file-types-util";

export const SUCCESS_GREEN = "#1E8E17";

export const gradient = (a, b) => zero_to_one => {
  const ans = a
    .map((a, i) => a + (b[i] - a) * zero_to_one)
    .map((a, i) => {
      if (i !== 3) {
        return Math.round(a);
      } else {
        return a;
      }
    });

  return ans;
};

export const setAlpha = (alpha, color) => {
  return color.slice(0, -1).concat([alpha]);
};

export const toRgba = a => `rgba(${a[0]}, ${a[1]}, ${a[2]}, ${a[3]})`;
export const fromRgba = a =>
  a
    .split(/rgba\(|, |\)/)
    .filter(a => a !== "")
    .map(Number);

export const toHex = a => {
  a = a.map(Number).map(a => {
    a = a.toString(16);
    if (a.length < 2) {
      a = "0" + a;
    }
    return a;
  });
  return `#${a[0]}${a[1]}${a[2]}`;
};

export const fromHex = a => {
  a = a
    .split(/#|([0-9a-f]{2})/)
    .filter(a => a && a !== "")
    .map(a => parseInt(a, 16));
  const default_alpha = 1;
  a.push(default_alpha);
  return a;
};

export const mostRecentDate = () => [255, 216, 155, 1];
export const mediumDate = () => [255, 140, 0, 1];
export const leastRecentDate = () => [20, 86, 130, 1];

const PLACEHOLDER_COLOR = "#8a8c93";
const PARENT_FOLDER_COLOR = "#f99a0b";
const FOLDER_COLOR = "#fabf0b";

const colors = {
  [FileType.PRESENTATION]: "#f75b40",
  [FileType.SPREADSHEET]: "#52d11a",
  [FileType.EMAIL]: "#13d6f3",
  [FileType.DOCUMENT]: "#4c78e8",
  [FileType.MEDIA]: "#b574f2",
  [FileType.OTHER]: "#8a8c93"
};

export const folder = () => FOLDER_COLOR;
export const parentFolder = () => PARENT_FOLDER_COLOR;

export const placeholder = () => PLACEHOLDER_COLOR;

export const fromFileName = name => {
  const fileType = getFileTypeFromFileName(name);
  return colors[fileType];
};
