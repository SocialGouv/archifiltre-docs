import { type VoidFunction } from "@common/utils/function";
import { v4 as uuid } from "uuid";

import { startLoadingAction } from "./loading-info-actions";
import { type LoadingInfoTypes } from "./loading-info-types";

/**
 * Starts a loading
 * @param type - The type of loadingInfo
 * @param goal - The goal to reach 100%
 * @param label - The loading label
 */
export const startLoading =
  (type: LoadingInfoTypes, goal: number, label: string, loadedLabel: string) =>
  (dispatch: VoidFunction): string => {
    const id = uuid();
    dispatch(startLoadingAction(id, type, goal, label, loadedLabel));
    return id;
  };
