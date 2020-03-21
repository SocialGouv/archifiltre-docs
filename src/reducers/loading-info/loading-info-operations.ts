import { v4 as uuid } from "uuid";
import { startLoadingAction } from "./loading-info-actions";

/**
 * Starts a loading
 * @param type - The type of loadingInfo
 * @param goal - The goal to reach 100%
 * @param label - The loading label
 */
export const startLoading = (type, goal, label) => (dispatch) => {
  const id = uuid();
  dispatch(startLoadingAction(id, type, goal, label));
  return id;
};
