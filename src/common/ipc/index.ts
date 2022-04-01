import type {
  IpcMain as BaseIpcMain,
  IpcMainInvokeEvent,
  IpcRenderer as BaseIpcRenderer,
} from "electron";
import {
  ipcMain as baseIpcMain,
  ipcRenderer as baseIpcRenderer,
} from "electron";

import type { UnknownMapping } from "../utils/types";
import type {
  AsyncIpcChannel,
  AsyncIpcKeys,
  CustomIpcMainEvent,
  GetAsyncIpcConfig,
  GetSyncIpcConfig,
  SyncIpcChannel,
  SyncIpcKeys,
} from "./event";

interface IpcMain extends BaseIpcMain {
  handle: <T extends AsyncIpcKeys | UnknownMapping>(
    channel: AsyncIpcChannel<T>,
    listener: (
      event: IpcMainInvokeEvent,
      ...args: GetAsyncIpcConfig<T>["args"]
    ) =>
      | GetAsyncIpcConfig<T>["returnValue"]
      | Promise<GetAsyncIpcConfig<T>["returnValue"]>
  ) => void;

  on: <T extends SyncIpcKeys | UnknownMapping>(
    channel: SyncIpcChannel<T>,
    listener: (
      event: CustomIpcMainEvent<T>,
      ...args: GetSyncIpcConfig<T>["args"]
    ) => void
  ) => this;
}
interface IpcRenderer extends BaseIpcRenderer {
  invoke: <T extends AsyncIpcKeys | UnknownMapping>(
    channel: AsyncIpcChannel<T>,
    ...args: GetAsyncIpcConfig<T>["args"]
  ) => Promise<GetAsyncIpcConfig<T>["returnValue"]>;

  sendSync: <T extends SyncIpcKeys | UnknownMapping>(
    channel: SyncIpcChannel<T>,
    ...args: GetSyncIpcConfig<T>["args"]
  ) => GetSyncIpcConfig<T>["returnValue"];
}

export const ipcMain = baseIpcMain as IpcMain;
export const ipcRenderer = baseIpcRenderer as IpcRenderer;
