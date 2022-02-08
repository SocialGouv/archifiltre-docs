import type { AnyAction } from "redux";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";

import type { SimpleObject } from "../util/object/object-util";
import type { StoreState } from "./store";

export type ArchifiltreDocsThunk = <TArgs>(
  ...args: TArgs[]
) => ArchifiltreDocsThunkAction;

export type ArchifiltreDocsDispatch = ThunkDispatch<
  StoreState,
  SimpleObject,
  AnyAction
>;

export type ArchifiltreDocsThunkAction<TReturnType = Promise<void> | void> =
  ThunkAction<TReturnType, StoreState, SimpleObject, AnyAction>;

export type DispatchExts = ThunkDispatch<StoreState, SimpleObject, AnyAction>;
