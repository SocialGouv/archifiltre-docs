import type { AnyAction } from "redux";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";

import type { StoreState } from "./store";

export type ArchifiltreThunk = <Args>(
    ...args: Args[]
) => ArchifiltreThunkAction;

export type ArchifiltreDispatch = ThunkDispatch<StoreState, {}, AnyAction>;

export type ArchifiltreThunkAction<ReturnType = void> = ThunkAction<
    ReturnType,
    StoreState,
    {},
    AnyAction
>;

export type DispatchExts = ThunkDispatch<StoreState, {}, AnyAction>;
