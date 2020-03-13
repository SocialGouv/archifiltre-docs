import { StoreState } from "../store";
import {
  ArchifiltreError,
  ArchifiltreErrorType,
  LoadingInfo,
  LoadingInfoState
} from "./loading-info-types";

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

/**
 * Selector for the errors list
 * @param store
 */
export const getArchifiltreErrors = (store: StoreState): ArchifiltreError[] =>
  getLoadingInfoFromStore(store).errors;

interface CreateArchifiltreErrorParams {
  type?: ArchifiltreErrorType;
  filePath?: string;
  reason?: string;
}

/**
 * Factory for archifiltre error object
 * @param type
 * @param filePath
 * @param reason
 */
export const createArchifiltreError = ({
  type = ArchifiltreErrorType.LOADING_FILE_SYSTEM,
  filePath = "/root",
  reason = "NOT_FOUND"
}: CreateArchifiltreErrorParams): ArchifiltreError => ({
  filePath,
  reason,
  type
});
