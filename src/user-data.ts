import * as ObjectUtil from "util/object/object-util";
import * as FsUtil from "util/file-system/file-sys-util";

import Fs from "fs";
import Path from "path";
import Crypto from "crypto";

import { app } from "@electron/remote";

const randomString = "WbXDHMMHojJEQHzY6TLFBq2LSOQjVktGRSp9HT07";
const basePath = Path.join(app.getPath("userData"), randomString);

interface InitialData {
  width: number;
  height: number;
}

interface UserData {
  reader: () => object;
  writer: (obj: any) => void;
}

export const create = (initialObj: InitialData): UserData => {
  FsUtil.mkdir(basePath);

  const keys = Object.keys(initialObj);
  const hash = Crypto.createHash("sha256");
  hash.update(JSON.stringify(initialObj));
  const path = Path.join(basePath, hash.digest("hex"));

  const reader = () => JSON.parse(Fs.readFileSync(path, "utf8"));
  const writer = (obj) => {
    obj = ObjectUtil.extractKeys(keys, obj);
    obj = ObjectUtil.compose(obj, initialObj);
    const json = JSON.stringify(obj);
    Fs.writeFileSync(path, json, "utf8");
  };

  if (!Fs.existsSync(path)) {
    writer(initialObj);
  }

  return {
    reader,
    writer,
  };
};
