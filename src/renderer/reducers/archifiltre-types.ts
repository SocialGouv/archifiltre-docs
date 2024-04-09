import { type SimpleObject } from "@common/utils/object";
import { type AnyAction } from "redux";
import { type ThunkAction, type ThunkDispatch } from "redux-thunk";

import { type StoreState } from "./store";

export type ArchifiltreDocsThunk = <TArgs>(...args: TArgs[]) => ArchifiltreDocsThunkAction;

export type ArchifiltreDocsDispatch = ThunkDispatch<StoreState, SimpleObject, AnyAction>;

export type ArchifiltreDocsThunkAction<TReturnType = Promise<void> | void> = ThunkAction<
  TReturnType,
  StoreState,
  SimpleObject,
  AnyAction
>;

export type DispatchExts = ThunkDispatch<StoreState, SimpleObject, AnyAction>;
