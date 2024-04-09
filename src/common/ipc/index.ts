import {
  type IpcMain as BaseIpcMain,
  ipcMain as baseIpcMain,
  type IpcMainInvokeEvent,
  type IpcRenderer as BaseIpcRenderer,
  ipcRenderer as baseIpcRenderer,
} from "electron";

import { type UnknownMapping } from "../utils/type";
import {
  type AsyncIpcChannel,
  type AsyncIpcKeys,
  type CustomIpcMainEvent,
  type CustomIpcRendererEvent,
  type DualAsyncIpcChannel,
  type DualAsyncIpcKeys,
  type GetAsyncIpcConfig,
  type GetDualAsyncIpcConfig,
  type GetRepliedDualAsyncIpcConfig,
  type GetSyncIpcConfig,
  type ReplyDualAsyncIpcChannel,
  type ReplyDualAsyncIpcKeys,
  type SyncIpcChannel,
  type SyncIpcKeys,
} from "./event";

interface IpcMain extends BaseIpcMain {
  handle: <T extends AsyncIpcKeys | UnknownMapping>(
    channel: AsyncIpcChannel<T>,
    listener: (
      event: IpcMainInvokeEvent,
      ...args: GetAsyncIpcConfig<T>["args"]
    ) => GetAsyncIpcConfig<T>["returnValue"] | Promise<GetAsyncIpcConfig<T>["returnValue"]>,
  ) => void;

  on: <T extends DualAsyncIpcKeys | SyncIpcKeys | UnknownMapping>(
    channel: DualAsyncIpcChannel<T> | SyncIpcChannel<T>,
    listener: (
      event: CustomIpcMainEvent<T>,
      ...args: T extends SyncIpcKeys
        ? // @ts-expect-error -- conflict because of pre filled ipc mapping
          GetSyncIpcConfig<T>["args"]
        : GetDualAsyncIpcConfig<T>["args"]
    ) => void,
  ) => this;
}
interface IpcRenderer extends BaseIpcRenderer {
  invoke: <T extends AsyncIpcKeys | UnknownMapping>(
    channel: AsyncIpcChannel<T>,
    ...args: GetAsyncIpcConfig<T>["args"]
  ) => Promise<GetAsyncIpcConfig<T>["returnValue"]>;

  off: <T extends ReplyDualAsyncIpcKeys | UnknownMapping>(
    channel: ReplyDualAsyncIpcChannel<T>,
    listener: (event: CustomIpcRendererEvent<T>, ...args: GetRepliedDualAsyncIpcConfig<T>["args"]) => void,
  ) => this;

  on: <T extends ReplyDualAsyncIpcKeys | UnknownMapping>(
    channel: ReplyDualAsyncIpcChannel<T>,
    listener: (event: CustomIpcRendererEvent<T>, ...args: GetRepliedDualAsyncIpcConfig<T>["args"]) => void,
  ) => this;

  send: <T extends DualAsyncIpcKeys | UnknownMapping>(
    channel: DualAsyncIpcChannel<T>,
    ...args: GetDualAsyncIpcConfig<T>["args"]
  ) => void;

  sendSync: <T extends SyncIpcKeys | UnknownMapping>(
    channel: SyncIpcChannel<T>,
    ...args: GetSyncIpcConfig<T>["args"]
  ) => GetSyncIpcConfig<T>["returnValue"];
}

export const ipcMain = baseIpcMain as IpcMain;
export const ipcRenderer = baseIpcRenderer as IpcRenderer;
