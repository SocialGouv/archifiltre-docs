import { StoreState } from "../store";
import { LoadingInfo, LoadingInfoState } from "./loading-info-types";

/**
 * Returns the loadingInfo from the store
 * @param store
 */
export const getLoadingInfoFromStore = (store: StoreState): LoadingInfoState =>
  store.loadingInfo;

/**
 * Returns the currently loading LoadingInfo
 * @param loading - The list of loading ids
 * @param loadingInfo - The map of loadingInfo
 */
export const getRunningLoadingInfo = ({
  loading,
  loadingInfo
}: LoadingInfoState): LoadingInfo[] => loading.map(id => loadingInfo[id]);

/**
 * Returns  the currently completed LoadingInfo
 * @param complete - The list of completed ids
 * @param loadingInfo - The map of loadingInfo
 */
export const getCompleteLoadingInfo = ({
  complete,
  loadingInfo
}: LoadingInfoState): LoadingInfo[] => complete.map(id => loadingInfo[id]);
