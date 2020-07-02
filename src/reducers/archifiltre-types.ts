import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { StoreState } from "./store";

export type ArchifiltreThunk = <Args>(
  ...args: Args[]
) => ArchifiltreThunkAction;

export type ArchifiltreThunkAction = ThunkAction<
  void,
  StoreState,
  {},
  AnyAction
>;

export type DispatchExts = ThunkDispatch<StoreState, {}, AnyAction>;
