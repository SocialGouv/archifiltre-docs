import Crypto from "crypto";
import fs from "fs";
import { join } from "path";

import { getPath } from "./util/electron/electron-util";
import * as FsUtil from "./util/file-system/file-sys-util";
import * as ObjectUtil from "./util/object/object-util";

const randomString = "WbXDHMMHojJEQHzY6TLFBq2LSOQjVktGRSp9HT07";
const basePath = join(getPath("userData"), randomString);

interface InitialData {
    width: number;
    height: number;
}

export interface UserData {
    reader: () => ObjectUtil.SimpleObject;
    writer: (obj: InitialData) => void;
}

export const create = (initialObj: InitialData): UserData => {
    FsUtil.mkdir(basePath);

    const keys = Object.keys(initialObj) as (keyof InitialData)[];
    const hash = Crypto.createHash("sha256");
    hash.update(JSON.stringify(initialObj));
    const path = join(basePath, hash.digest("hex"));

    const reader = () =>
        JSON.parse(fs.readFileSync(path, "utf8")) as ObjectUtil.SimpleObject;
    const writer = (obj: Partial<InitialData>) => {
        obj = ObjectUtil.extractKeys(keys, obj);
        obj = ObjectUtil.compose(obj, initialObj);
        const json = JSON.stringify(obj);
        fs.writeFileSync(path, json, "utf8");
    };

    if (!fs.existsSync(path)) {
        writer(initialObj);
    }

    return {
        reader,
        writer,
    };
};
