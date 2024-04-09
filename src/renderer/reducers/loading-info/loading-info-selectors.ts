import { type ArchifiltreDocsError, ArchifiltreDocsErrorType } from "@common/utils/error";
import { type ArchifiltreDocsErrorCode, UnknownError } from "@common/utils/error/error-codes";
import { useSelector } from "react-redux";

import { type StoreState } from "../store";
import { type LoadingInfo, type LoadingInfoState } from "./loading-info-types";

/**
 * Returns the loadingInfo from the store
 */
export const getLoadingInfoFromStore = (store: StoreState): LoadingInfoState => store.loadingInfo;

/**
 * Returns the currently loading LoadingInfo
 * @param loading - The list of loading ids
 * @param loadingInfo - The map of loadingInfo
 */
export const getRunningLoadingInfo = ({ loading, loadingInfo }: LoadingInfoState): LoadingInfo[] =>
  loading.map(id => loadingInfo[id]);

/**
 * Returns  the currently completed LoadingInfo
 * @param complete - The list of completed ids
 * @param loadingInfo - The map of loadingInfo
 */
export const getCompleteLoadingInfo = ({ complete, loadingInfo }: LoadingInfoState): LoadingInfo[] =>
  complete.map(id => loadingInfo[id]);

/**
 * Selector for the errors list
 */
export const getArchifiltreDocsErrors = (store: StoreState): ArchifiltreDocsError[] =>
  getLoadingInfoFromStore(store).errors;

export const useArchifiltreDocsErrors = (): ArchifiltreDocsError[] => useSelector(getArchifiltreDocsErrors);

interface CreateArchifiltreDocsErrorParams {
  code?: ArchifiltreDocsErrorCode;
  filePath?: string;
  reason?: string;
  type?: ArchifiltreDocsErrorType;
}

/**
 * Factory for archifiltre error object
 */
export const createArchifiltreDocsError = ({
  type = ArchifiltreDocsErrorType.LOADING_FILE_SYSTEM,
  filePath = "/root",
  reason = "NOT_FOUND",
  code = UnknownError.UNKNOWN,
}: CreateArchifiltreDocsErrorParams): ArchifiltreDocsError => ({
  code,
  filePath,
  reason,
  type,
});
