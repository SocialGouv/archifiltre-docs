import type {
    IpcMain as BaseIpcMain,
    IpcMainInvokeEvent,
    IpcRenderer as BaseIpcRenderer,
} from "electron";
import {
    ipcMain as baseIpcMain,
    ipcRenderer as baseIpcRenderer,
} from "electron";

import type {
    AsyncIpcChannel,
    AsyncIpcKeys,
    CustomIpcMainEvent,
    GetAsyncIpcConfig,
    GetSyncIpcConfig,
    SyncIpcChannel,
    SyncIpcKeys,
    UnknownMapping,
} from "./event";

interface IpcMain extends BaseIpcMain {
    on: <T extends SyncIpcKeys | UnknownMapping>(
        channel: SyncIpcChannel<T>,
        listener: (
            event: CustomIpcMainEvent<T>,
            ...args: GetSyncIpcConfig<T>["args"]
        ) => void
    ) => this;

    handle: <T extends AsyncIpcKeys | UnknownMapping>(
        channel: AsyncIpcChannel<T>,
        listener: (
            event: IpcMainInvokeEvent,
            ...args: GetAsyncIpcConfig<T>["args"]
        ) =>
            | GetAsyncIpcConfig<T>["returnValue"]
            | Promise<GetAsyncIpcConfig<T>["returnValue"]>
    ) => void;
}
interface IpcRenderer extends BaseIpcRenderer {
    sendSync: <T extends SyncIpcKeys | UnknownMapping>(
        channel: SyncIpcChannel<T>,
        ...args: GetSyncIpcConfig<T>["args"]
    ) => GetSyncIpcConfig<T>["returnValue"];

    invoke: <T extends AsyncIpcKeys | UnknownMapping>(
        channel: AsyncIpcChannel<T>,
        ...args: GetAsyncIpcConfig<T>["args"]
    ) => Promise<GetAsyncIpcConfig<T>["returnValue"]>;
}

export const ipcMain = baseIpcMain as IpcMain;
export const ipcRenderer = baseIpcRenderer as IpcRenderer;
