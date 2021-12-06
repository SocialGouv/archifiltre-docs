import { createHash } from "crypto";
import fs from "fs";
import { join } from "path";

import { getPath } from "./util/electron/electron-util";
import { mkdir } from "./util/file-system/file-sys-util";
import { compose, extractKeys } from "./util/object/object-util";

const randomString = "WbXDHMMHojJEQHzY6TLFBq2LSOQjVktGRSp9HT07";
const basePath = join(getPath("userData"), randomString);

interface InitialData {
    width: number;
    height: number;
}

export interface UserData<T = InitialData> {
    reader: () => T;
    writer: (obj: T) => void;
}

export const create = <T>(initialObj: T): UserData<T> => {
    mkdir(basePath);

    const keys = Object.keys(initialObj) as (keyof T)[];
    const hash = createHash("sha256");
    hash.update(JSON.stringify(initialObj));
    const path = join(basePath, hash.digest("hex"));

    const reader = () => JSON.parse(fs.readFileSync(path, "utf8")) as T;
    const writer = (obj: Partial<T>) => {
        obj = extractKeys(keys, obj);
        obj = compose(obj, initialObj);
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
