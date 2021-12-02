import type { AnyAction } from "redux";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";

import type { SimpleObject } from "../util/object/object-util";
import type { StoreState } from "./store";

export type ArchifiltreThunk = <TArgs>(
    ...args: TArgs[]
) => ArchifiltreThunkAction;

export type ArchifiltreDispatch = ThunkDispatch<
    StoreState,
    SimpleObject,
    AnyAction
>;

export type ArchifiltreThunkAction<TReturnType = Promise<void> | void> =
    ThunkAction<TReturnType, StoreState, SimpleObject, AnyAction>;

export type DispatchExts = ThunkDispatch<StoreState, SimpleObject, AnyAction>;
