import type { IpcMainEvent } from "electron";

import type { UnknownMapping } from "../types";

/**
 * Define an IPC config with arguments types and a return value type.
 *
 * Arguments should be considered as a spreadable array of args.
 */
export interface IpcConfig<TArgs extends unknown[], TReturnValue> {
    args: TArgs;
    returnValue: TReturnValue;
}

/**
 * A default IPC config if you only need to declare an IPC channel for autocomplete.
 */
export type DefaultIpcConfig = IpcConfig<unknown[], unknown>;

/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on sync ipc "on/sendSync" combo.
 *
 * @see IpcConfig
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SyncIpcMapping {}
/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on async ipc "handle/invoke" combo.
 *
 * @see IpcConfig
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AsyncIpcMapping {}
export type SyncIpcKeys = keyof SyncIpcMapping;
export type AsyncIpcKeys = keyof AsyncIpcMapping;

export type GetSyncIpcConfig<T> = T extends SyncIpcKeys
    ? SyncIpcMapping[T]
    : DefaultIpcConfig;
export type GetAsyncIpcConfig<T> = T extends AsyncIpcKeys
    ? AsyncIpcMapping[T]
    : DefaultIpcConfig;

export type SyncIpcChannel<T extends SyncIpcKeys | UnknownMapping> =
    | SyncIpcKeys
    | T;
export type AsyncIpcChannel<T extends AsyncIpcKeys | UnknownMapping> =
    | AsyncIpcKeys
    | T;

export interface CustomIpcMainEvent<T> extends IpcMainEvent {
    returnValue: GetSyncIpcConfig<T>["returnValue"];
}
