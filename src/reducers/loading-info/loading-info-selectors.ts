import { StoreState } from "../store";
import { LoadingInfo, LoadingInfoState } from "./loading-info-types";
import { ArchifiltreError, ArchifiltreErrorType } from "util/error/error-util";
import { useSelector } from "react-redux";
import { ArchifiltreErrorCode, UnknownError } from "util/error/error-codes";

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
  loadingInfo,
}: LoadingInfoState): LoadingInfo[] => loading.map((id) => loadingInfo[id]);

/**
 * Returns  the currently completed LoadingInfo
 * @param complete - The list of completed ids
 * @param loadingInfo - The map of loadingInfo
 */
export const getCompleteLoadingInfo = ({
  complete,
  loadingInfo,
}: LoadingInfoState): LoadingInfo[] => complete.map((id) => loadingInfo[id]);

/**
 * Selector for the errors list
 * @param store
 */
export const getArchifiltreErrors = (store: StoreState): ArchifiltreError[] =>
  getLoadingInfoFromStore(store).errors;

export const useArchifiltreErrors = (): ArchifiltreError[] =>
  useSelector(getArchifiltreErrors);

interface CreateArchifiltreErrorParams {
  type?: ArchifiltreErrorType;
  filePath?: string;
  reason?: string;
  code?: ArchifiltreErrorCode;
}

/**
 * Factory for archifiltre error object
 * @param type
 * @param filePath
 * @param reason
 * @param code
 */
export const createArchifiltreError = ({
  type = ArchifiltreErrorType.LOADING_FILE_SYSTEM,
  filePath = "/root",
  reason = "NOT_FOUND",
  code = UnknownError.UNKNOWN,
}: CreateArchifiltreErrorParams): ArchifiltreError => ({
  code,
  filePath,
  reason,
  type,
});
