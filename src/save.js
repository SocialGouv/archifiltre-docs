import FileSaver from "file-saver";

export function save(name, json) {
  const blob = new Blob([json], { type: "text/plain;charset=utf-8" });
  FileSaver.saveAs(blob, name);
}

export const makeNameWithExt = (name, ext) => {
  return name + "_" + new Date().getTime() + "." + ext;
};
