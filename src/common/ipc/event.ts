/* eslint-disable @typescript-eslint/no-empty-interface */
import type { IpcMainEvent, IpcRendererEvent } from "electron";

import type { Nothing, UnknownMapping } from "../utils/type";

/**
 * Define an IPC config with arguments type and a return values type.
 *
 * Arguments should be considered as a spreadable array of args.
 */
export interface IpcConfig<TArgs extends unknown[], TReturnValue> {
  args: TArgs;
  returnValue: TReturnValue;
}

/**
 * Define an asynchronous IPC config (e.g. `ipcRenderer.send()`) with arguments
 * type, return values type, and an channel that will be asynchronously called back with those return values.
 *
 * Arguments and return values should be considered as a spreadable array of args.
 */
export interface DualIpcConfig<
  TReplyChannel extends string,
  TArgs extends unknown[],
  TReturnValues extends unknown[]
> extends IpcConfig<TArgs, TReturnValues> {
  replyKey: TReplyChannel;
}

/**
 * A default IPC config if you only need to declare an IPC channel for autocomplete.
 */
export type DefaultIpcConfig = IpcConfig<unknown[], unknown>;
/**
 * A default asynchronous IPC config if you only need to declare an IPC channel for autocomplete.
 */
export type DefaultDualIpcConfig = DualIpcConfig<"", unknown[], unknown[]>;

//TODO: rename mapping interface with more contextual and understandable names
/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on sync ipc "on/sendSync" combo.
 *
 * @see IpcConfig
 */
export interface SyncIpcMapping {}
/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on async ipc "handle/invoke" combo.
 *
 * @see IpcConfig
 */
export interface AsyncIpcMapping {}

/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on async ipc "on/send" combo.
 *
 * @see DualIpcConfig
 */
export interface DualAsyncIpcMapping {}

/**
 * @internal
 */
export type ReplyDualAsyncIpcMapping = {
  [K in DualAsyncIpcKeys]: DualAsyncIpcMapping[K]["replyKey"] extends
    | Nothing
    | ""
    ? never
    : {
        [ReplyKey in DualAsyncIpcMapping[K]["replyKey"]]: IpcConfig<
          Extract<
            DualAsyncIpcMapping[K],
            { replyKey: ReplyKey }
          >["returnValue"],
          void
        >;
      };
}[DualAsyncIpcKeys];

export type SyncIpcKeys = keyof SyncIpcMapping;
export type AsyncIpcKeys = keyof AsyncIpcMapping;
export type DualAsyncIpcKeys = keyof DualAsyncIpcMapping;
export type ReplyDualAsyncIpcKeys = keyof ReplyDualAsyncIpcMapping;

export type GetSyncIpcConfig<T> = T extends SyncIpcKeys
  ? SyncIpcMapping[T]
  : DefaultIpcConfig;
export type GetAsyncIpcConfig<T> = T extends AsyncIpcKeys
  ? AsyncIpcMapping[T]
  : DefaultIpcConfig;
export type GetDualAsyncIpcConfig<T> = T extends DualAsyncIpcKeys
  ? DualAsyncIpcMapping[T]
  : DefaultDualIpcConfig;
export type GetRepliedDualAsyncIpcConfig<T> = T extends ReplyDualAsyncIpcKeys
  ? ReplyDualAsyncIpcMapping[T]
  : DefaultIpcConfig;

export type SyncIpcChannel<T extends SyncIpcKeys | UnknownMapping> =
  | SyncIpcKeys
  | T;
export type AsyncIpcChannel<T extends AsyncIpcKeys | UnknownMapping> =
  | AsyncIpcKeys
  | T;
export type DualAsyncIpcChannel<T extends DualAsyncIpcKeys | UnknownMapping> =
  | DualAsyncIpcKeys
  | T;
export type ReplyDualAsyncIpcChannel<
  T extends ReplyDualAsyncIpcKeys | UnknownMapping
> = ReplyDualAsyncIpcKeys | T;

// -- augments
interface CustomSyncIpcMainEvent<T extends string> extends IpcMainEvent {
  /**
   * Sync event comming from `ipcRenderer.sendSync`. Use `ipcRenderer.send` to return a sync value.
   * @deprecated
   */
  reply: never;
  returnValue: GetSyncIpcConfig<T>["returnValue"];
  type: T;
}

interface CustomAsyncIpcMainEvent<T extends string> extends IpcMainEvent {
  reply: (
    replyChannel: GetDualAsyncIpcConfig<T>["replyKey"],
    ...args: GetDualAsyncIpcConfig<T>["returnValue"]
  ) => void;
  /**
   * Async event comming from `ipcRenderer.send`. Use `ipcRenderer.sendSync` to return a sync value.
   * @deprecated
   */
  returnValue: never;
  type: T;
}

export type CustomIpcMainEvent<T> = T extends SyncIpcKeys
  ? CustomSyncIpcMainEvent<T>
  : T extends DualAsyncIpcKeys
  ? CustomAsyncIpcMainEvent<T>
  : IpcMainEvent;

interface CustomAsyncIpcRendererEvent<T extends string>
  extends IpcRendererEvent {
  type: T;
}

export type CustomIpcRendererEvent<T> = T extends ReplyDualAsyncIpcKeys
  ? CustomAsyncIpcRendererEvent<T>
  : IpcRendererEvent;
