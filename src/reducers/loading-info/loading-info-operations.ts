import { v4 as uuid } from "uuid";
import { startLoadingAction } from "./loading-info-actions";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";

/**
 * Starts a loading
 * @param type - The type of loadingInfo
 * @param goal - The goal to reach 100%
 * @param label - The loading label
 */
export const startLoading = (
  type: LoadingInfoTypes,
  goal: number,
  label: string,
  loadedLabel: string
) => (dispatch) => {
  const id = uuid();
  dispatch(startLoadingAction(id, type, goal, label, loadedLabel));
  return id;
};
