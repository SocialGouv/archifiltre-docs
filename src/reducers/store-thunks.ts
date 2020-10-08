import _ from "lodash";
import { reportError } from "logging/reporter";
import path from "path";
import { mapToNewVersionNumbers } from "components/header/new-version-checker";
import { firstHashesComputingThunk } from "hash-computer/hash-computer-thunk";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { ROOT_FF_ID } from "reducers/files-and-folders/files-and-folders-selectors";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";
import { tap } from "rxjs/operators";
import translations from "translations/translations";
import { filterResults } from "util/batch-process/batch-process-util";
import {
  filesAndFoldersMapToArray,
  getFiles,
  getFirstLevelName,
} from "util/files-and-folders/file-and-folders-utils";
import {
  countZipFiles,
  isJsonFile,
  isRootPath,
  octet2HumanReadableFormat,
} from "util/file-system/file-sys-util";
import { empty } from "util/function/function-util";
import {
  NotificationDuration,
  notifyError,
  notifyInfo,
} from "util/notification/notifications-util";
import { operateOnDataProcessingStream } from "util/observable/observable-util";
import version, { versionComparator } from "../version";
import {
  ArchifiltreThunkAction,
  ArchifiltreDispatch,
} from "./archifiltre-types";
import { initFilesAndFoldersMetatada } from "./files-and-folders-metadata/files-and-folders-metadata-actions";
import {
  addCommentsOnFilesAndFolders,
  initializeFilesAndFolders,
  initVirtualPathToIdMap,
  markElementsToDelete,
  setFilesAndFoldersAliases,
} from "./files-and-folders/files-and-folders-actions";
import {
  registerErrorAction,
  resetLoadingAction,
} from "./loading-info/loading-info-actions";
import { clearActionReplayFile } from "./middleware/persist-actions-middleware";
import { initializeTags, resetTags } from "./tags/tags-actions";
import {
  setLockedElementId,
  setOriginalPath,
  setSessionName,
} from "./workspace-metadata/workspace-metadata-actions";
import { getArchifiltreErrors } from "./loading-info/loading-info-selectors";
import { openModalAction } from "./modal/modal-actions";
import { Modal } from "./modal/modal-types";
import {
  HookParam,
  loadFileTree,
} from "util/file-tree-loader/file-tree-loader";
import { commitAction } from "./enhancers/undoable/undoable-actions";
import {
  resetLoadingState,
  setConstructedDataModelElementsCount,
  setDerivedElementsCount,
  setFileSystemLoadingStep,
  setIndexedFilesCount,
  setLoadingStep,
} from "./loading-state/loading-state-actions";
import {
  FileSystemLoadingStep,
  LoadingStep,
} from "./loading-state/loading-state-types";
import { setFilesAndFoldersHashes } from "./hashes/hashes-actions";
import { resetZoom } from "reducers/main-space-selection/main-space-selection-action";
import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";

/**
 * Notifies the user that there is a Zip in the loaded files
 * @param zipCount - The number of zip files detected
 */
const displayZipNotification = (zipCount) => {
  notifyInfo(
    translations.t("folderDropzone.zipNotificationMessage"),
    `${zipCount} ${translations.t("folderDropzone.zipNotificationTitle")}`,
    NotificationDuration.PERMANENT
  );
};

/**
 * Notifies the user that the imported JSON version is different from current version
 */
const displayJsonNotification = () => {
  notifyInfo(
    translations.t("folderDropzone.wrongJsonVersion"),
    translations.t("folderDropzone.warning"),
    NotificationDuration.PERMANENT
  );
};

/**
 * Notifies the user that errors occurred while loading the folder
 */
const displayErrorNotification = () => (dispatch) => {
  notifyError(
    translations.t("folderDropzone.errorsWhileLoading"),
    translations.t("folderDropzone.error"),
    NotificationDuration.PERMANENT,
    () => dispatch(openModalAction(Modal.ERROR_MODAL))
  );
};

const displayRootPathError = () => {
  notifyError(
    translations.t("folderDropzone.errorsWhileLoading"),
    translations.t("folderDropzone.rootElementError")
  );
  return { virtualFileSystem: Promise.reject(), terminate: empty };
};

/**
 * Handles tracking events sent to Matomo
 * @param paths of files that need to be tracked
 */
const handleTracking = (paths, filesAndFoldersMap): ArchifiltreThunkAction => (
  dispatch,
  getState
) => {
  const filesAndFoldersMetadataMap = getFilesAndFoldersMetadataFromStore(
    getState()
  );

  const treeVolume = filesAndFoldersMetadataMap[ROOT_FF_ID].childrenTotalSize;

  const fileCount = paths.length;
  const foldersCount = Object.keys(filesAndFoldersMap).length - fileCount;

  const elementsByExtension = _(paths)
    .map(path.extname)
    .countBy(_.identity())
    .map((count, extension) => `${extension || "[No extension]"}: ${count}`)
    .unshift(`Folders dropped: ${foldersCount}`)
    .unshift(`Files dropped: ${fileCount}`)
    .unshift(`Total volume: ${octet2HumanReadableFormat(treeVolume)}`)
    .join("; \r\n");

  addTracker({
    eventValue: paths.length,
    title: ActionTitle.FILE_TREE_DROP,
    type: ActionType.TRACK_EVENT,
    value: elementsByExtension,
  });
};

const defaultHookParam: HookParam = {};

const handleLoadingTimeTracking = (loadingStart: number) => {
  const loadingEnd = new Date().getTime();
  const loadingTime = `${(loadingEnd - loadingStart) / 1000}s`; // Loading time in seconds
  addTracker({
    eventValue: loadingTime,
    title: ActionTitle.LOADING_TIME,
    type: ActionType.TRACK_EVENT,
    value: `Loading time: ${loadingTime}`,
  });
};

const handleZipNotificationDisplay = (paths: string[]) => {
  const zipFileCount = countZipFiles(paths);
  if (zipFileCount > 0) {
    displayZipNotification(zipFileCount);
  }
};

const handleErrorNotificationDisplay = (): ArchifiltreThunkAction => async (
  dispatch,
  getState
) => {
  const errors = getArchifiltreErrors(getState());

  if (errors.length > 0) {
    dispatch(displayErrorNotification());
  }
};

const handleHashComputing = (
  virtualFileSystem: VirtualFileSystem
): ArchifiltreThunkAction => async (dispatch) => {
  dispatch(
    firstHashesComputingThunk(virtualFileSystem.originalPath, {
      ignoreFileHashes:
        virtualFileSystem.hashes !== null &&
        Object.keys(virtualFileSystem.hashes).length > 0,
    })
  );
};

const handleNonJsonFileThunk = (
  fileOrFolderPath: string,
  virtualFileSystem: VirtualFileSystem
): ArchifiltreThunkAction => (dispatch) => {
  if (!isJsonFile(fileOrFolderPath)) {
    const paths = getFiles(
      filesAndFoldersMapToArray(virtualFileSystem.filesAndFolders)
    ).map((file) => file.id);
    dispatch(handleTracking(paths, virtualFileSystem.filesAndFolders));
    handleZipNotificationDisplay(paths);
    dispatch(handleErrorNotificationDisplay());
    dispatch(handleHashComputing(virtualFileSystem));
  }
};

const handleJsonNotificationDisplay = (
  fileOrFolderPath: string,
  virtualFileSystem: VirtualFileSystem
) => {
  if (isJsonFile(fileOrFolderPath)) {
    const jsonVersion = mapToNewVersionNumbers(`${virtualFileSystem.version}`);
    const currentVersion = mapToNewVersionNumbers(version);
    if (versionComparator(jsonVersion, currentVersion) !== 0) {
      displayJsonNotification();
    }
  }
};

const handleVirtualFileSystemThunk = (
  fileOrFolderPath: string,
  virtualFileSystem: VirtualFileSystem
): ArchifiltreThunkAction => async (dispatch) => {
  handleJsonNotificationDisplay(fileOrFolderPath, virtualFileSystem);
  dispatch(initStore(virtualFileSystem));
  dispatch(setLoadingStep(LoadingStep.FINISHED));
  dispatch(commitAction());
  dispatch(handleNonJsonFileThunk(fileOrFolderPath, virtualFileSystem));
};

const makeLoadFilesAndFoldersErrorHandler = (dispatch: ArchifiltreDispatch) =>
  tap<ArchifiltreError>((error) => {
    dispatch(registerErrorAction(error));
  });

const makeLoadFilesAndFoldersResultHandler = (dispatch: ArchifiltreDispatch) =>
  tap<HookParam>(({ status, count = 0 } = defaultHookParam) => {
    switch (status) {
      case FileSystemLoadingStep.INDEXING:
        dispatch(setIndexedFilesCount(count));
        dispatch(setFileSystemLoadingStep(status));
        break;
      case FileSystemLoadingStep.FILES_AND_FOLDERS:
        dispatch(setConstructedDataModelElementsCount(count));
        dispatch(setFileSystemLoadingStep(status));
        break;
      case FileSystemLoadingStep.METADATA:
        dispatch(setDerivedElementsCount(count));
        dispatch(setFileSystemLoadingStep(status));
        break;
      case FileSystemLoadingStep.COMPLETE:
        dispatch(setFileSystemLoadingStep(FileSystemLoadingStep.COMPLETE));
    }
  });

const loadFilesAndFoldersAfterInitThunk = (
  fileOrFolderPath: string
): ArchifiltreThunkAction<VirtualFileSystemLoader> => (dispatch) => {
  const { result$, terminate } = loadFileTree(fileOrFolderPath);
  const virtualFileSystem = operateOnDataProcessingStream<HookParam, HookParam>(
    result$,
    {
      error: makeLoadFilesAndFoldersErrorHandler(dispatch),
      result: makeLoadFilesAndFoldersResultHandler(dispatch),
    }
  )
    .pipe(filterResults())
    .toPromise()
    .then(({ result: { result } }) => {
      dispatch(handleVirtualFileSystemThunk(fileOrFolderPath, result));
      return result;
    });

  return {
    virtualFileSystem,
    terminate,
  };
};

type VirtualFileSystemLoader = {
  virtualFileSystem: Promise<VirtualFileSystem>;
  terminate: () => void;
};

const tryLoadFilesAndFoldersAfterInitThunk = (
  fileOrFolderPath: string
): ArchifiltreThunkAction<VirtualFileSystemLoader> => (dispatch) => {
  try {
    return dispatch(loadFilesAndFoldersAfterInitThunk(fileOrFolderPath));
  } catch (error) {
    reportError(error);
    dispatch(setLoadingStep(LoadingStep.ERROR));
    return {
      virtualFileSystem: Promise.reject(),
      terminate: empty,
    };
  }
};

const loadFilesAndFoldersFromValidPathThunk = (
  fileOrFolderPath: string
): ArchifiltreThunkAction<Promise<VirtualFileSystemLoader>> => async (
  dispatch
) => {
  await clearActionReplayFile();
  const loadingStart = new Date().getTime();
  const { virtualFileSystem, terminate } = dispatch(
    tryLoadFilesAndFoldersAfterInitThunk(fileOrFolderPath)
  );
  virtualFileSystem.then(() => handleLoadingTimeTracking(loadingStart));
  return { virtualFileSystem, terminate };
};

export const loadFilesAndFoldersFromPathThunk = (
  fileOrFolderPath: string
): ArchifiltreThunkAction<Promise<VirtualFileSystemLoader>> => async (
  dispatch
) =>
  isRootPath(fileOrFolderPath)
    ? displayRootPathError()
    : dispatch(loadFilesAndFoldersFromValidPathThunk(fileOrFolderPath));

/**
 * Initializes the store with the data extracted from the JSON object
 * @param filesAndFolders
 * @param filesAndFoldersMetadata
 * @param hashesMap
 * @param tags
 */
const initStore = ({
  aliases,
  comments,
  elementsToDelete,
  filesAndFolders,
  filesAndFoldersMetadata,
  hashes,
  originalPath,
  sessionName,
  tags,
  virtualPathToIdMap,
}: VirtualFileSystem): ArchifiltreThunkAction => (dispatch) => {
  dispatch(initializeFilesAndFolders(filesAndFolders));
  dispatch(initFilesAndFoldersMetatada(filesAndFoldersMetadata));
  dispatch(setOriginalPath(originalPath));
  dispatch(setSessionName(sessionName || getFirstLevelName(filesAndFolders)));

  dispatch(initVirtualPathToIdMap(virtualPathToIdMap));
  if (hashes) {
    dispatch(setFilesAndFoldersHashes(hashes));
  }

  if (tags) {
    dispatch(initializeTags(tags));
  }

  if (aliases) {
    dispatch(setFilesAndFoldersAliases(aliases));
  }

  if (comments) {
    dispatch(addCommentsOnFilesAndFolders(comments));
  }

  if (elementsToDelete) {
    dispatch(markElementsToDelete(elementsToDelete));
  }
};

export const resetStoreThunk = (): ArchifiltreThunkAction => (dispatch) => {
  dispatch(resetTags());
  dispatch(resetLoadingAction());
  dispatch(resetLoadingState());
  dispatch(setLockedElementId(""));
  dispatch(setLoadingStep(LoadingStep.WAITING));
  dispatch(resetZoom());
  dispatch(commitAction());
};
