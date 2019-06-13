import * as ObjectUtil from "util/object-util";
import * as FsUtil from "util/file-sys-util";

const Fs = require("fs");
const Path = require("path");

const Crypto = require("crypto");

const App = require("electron").remote.app;

const random_string  = "WbXDHMMHojJEQHzY6TLFBq2LSOQjVktGRSp9HT07";
const base_path = Path.join(App.getPath("userData"), random_string);

export const create = initial_obj => {
  FsUtil.mkdir(base_path);

  const keys = Object.keys(initial_obj);
  const hash = Crypto.createHash("sha256");
  hash.update(JSON.stringify(initial_obj));
  const path = Path.join(base_path, hash.digest("hex"));

  const reader = () => JSON.parse(Fs.readFileSync(path, "utf8"));
  const writer = obj => {
    obj = ObjectUtil.extractKeys(keys, obj);
    obj = ObjectUtil.compose(
      obj,
      initial_obj
    );
    const json = JSON.stringify(obj);
    Fs.writeFileSync(path, json, "utf8");
  };

  if (Fs.existsSync(path) === false) {
    writer(initial_obj);
  }

  return {
    reader,
    writer
  };
};
