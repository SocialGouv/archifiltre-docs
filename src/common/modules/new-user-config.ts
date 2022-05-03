import Store from "electron-store";

import { IS_MAIN, IS_PACKAGED } from "../config";
import { ipcMain, ipcRenderer } from "../ipc";
import { schema } from "./user-config/schema";
import type { UserConfigObject } from "./user-config/type";

let inited = false;
let store: Store<UserConfigObject> | null = null;

function ensureInited(
  _store = store
): asserts _store is Store<UserConfigObject> {
  if (!inited) {
    throw new Error("(New)UserConfig is not inited.");
  }
}

declare module "../ipc/event" {
  interface SyncIpcMapping {
    "user-config.get": {
      [K in keyof UserConfigObject]: IpcConfig<[key: K], UserConfigObject[K]>;
    }[keyof UserConfigObject];
    "user-config.getAll": IpcConfig<[], UserConfigObject>;
    "user-config.set": {
      [K in keyof UserConfigObject]: IpcConfig<
        [key: K, value: UserConfigObject[K]],
        UserConfigObject[K]
      >;
    }[keyof UserConfigObject];
  }
}

export const initNewUserConfig = async (): Promise<void> => {
  if (inited) return;

  store = new Store<UserConfigObject>({
    clearInvalidConfig: true,
    defaults: {
      _firstOpened: true,
      appId: (await import("uuid")).v4(),
      fullscreen: true,
    },
    name: IS_PACKAGED() ? "config" : "archifiltre-docs",
    schema,
  });

  ipcMain.on("user-config.get", (event, key) => {
    ensureInited(store);
    event.returnValue = store.get(key);
  });
  ipcMain.on("user-config.getAll", (event) => {
    ensureInited(store);
    event.returnValue = store.store;
  });
  ipcMain.on("user-config.set", (event, key, value) => {
    ensureInited(store);
    store.set(key, value);
    event.returnValue = value;
  });

  inited = true;
};

export function get<TKey extends keyof UserConfigObject>(
  key: TKey
): UserConfigObject[TKey] {
  if (IS_MAIN) {
    ensureInited(store);
    return store.get(key);
  }
  return ipcRenderer.sendSync("user-config.get", key) as UserConfigObject[TKey];
}

export function getAll(): UserConfigObject {
  if (IS_MAIN) {
    ensureInited(store);
    return { ...store.store };
  }
  return ipcRenderer.sendSync("user-config.getAll");
}

export function set<TKey extends keyof UserConfigObject>(
  key: TKey,
  value: UserConfigObject[TKey]
): UserConfigObject[TKey] {
  if (IS_MAIN) {
    ensureInited(store);
    store.set(key, value);
    return value;
  }
  return ipcRenderer.sendSync(
    "user-config.set",
    key as never,
    value as never
  ) as UserConfigObject[TKey];
}
