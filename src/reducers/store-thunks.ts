import _, { noop } from "lodash";
import { compose } from "lodash/fp";
import path from "path";
import type { Observable, OperatorFunction } from "rxjs";
import { tap } from "rxjs/operators";

import { mapToNewVersionNumbers } from "../components/header/new-version-checker";
import type { VirtualFileSystem } from "../files-and-folders-loader/files-and-folders-loader-types";
import { firstHashesComputingThunk } from "../hash-computer/hash-computer-thunk";
import { reportError } from "../logging/reporter";
import { addTracker } from "../logging/tracker";
import { ActionTitle, ActionType } from "../logging/tracker-types";
import { translations } from "../translations/translations";
import { filterResults } from "../util/batch-process/batch-process-util";
import type {
  ErrorMessage,
  ResultMessage,
} from "../util/batch-process/batch-process-util-types";
import { copyToClipboard } from "../util/clipboard/clipboard";
import { ArchifiltreStoreThunkErrorCode } from "../util/error/error-codes";
import type { ArchifiltreError } from "../util/error/error-util";
import {
  ArchifiltreErrorType,
  makeErrorHandler,
} from "../util/error/error-util";
import {
  countZipFiles,
  isJsonFile,
  isRootPath,
  isValidFolderPath,
  octet2HumanReadableFormat,
} from "../util/file-system/file-sys-util";
import type { HookParam } from "../util/file-tree-loader/file-tree-loader";
import { loadFileTree } from "../util/file-tree-loader/file-tree-loader";
import {
  filesAndFoldersMapToArray,
  getFiles,
  getFirstLevelName,
} from "../util/files-and-folders/file-and-folders-utils";
import {
  NotificationDuration,
  notifyError,
  notifyInfo,
} from "../util/notification/notifications-util";
import { operateOnDataProcessingStream } from "../util/observable/observable-util";
import { workerManager } from "../util/worker-manager/worker-manager";
import { version, versionComparator } from "../version";
import type {
  ArchifiltreDispatch,
  ArchifiltreThunkAction,
} from "./archifiltre-types";
import { commitAction } from "./enhancers/undoable/undoable-actions";
import {
  addCommentsOnFilesAndFolders,
  initializeFilesAndFolders,
  initOverrideLastModified,
  initVirtualPathToIdMap,
  markElementsToDelete,
  registerErroredElements,
  resetErroredElements,
  resetOverrideLastModified,
  setFilesAndFoldersAliases,
} from "./files-and-folders/files-and-folders-actions";
import {
  getErroredFilesAndFolders,
  getFilesAndFoldersFromStore,
  ROOT_FF_ID,
} from "./files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "./files-and-folders/files-and-folders-types";
import { initFilesAndFoldersMetatada } from "./files-and-folders-metadata/files-and-folders-metadata-actions";
import { getFilesAndFoldersMetadataFromStore } from "./files-and-folders-metadata/files-and-folders-metadata-selectors";
import { setFilesAndFoldersHashes } from "./hashes/hashes-actions";
import {
  registerErrorAction,
  resetLoadingAction,
} from "./loading-info/loading-info-actions";
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
import { clearActionReplayFile } from "./middleware/persist-actions-middleware";
import { openModalAction } from "./modal/modal-actions";
import { Modal } from "./modal/modal-types";
import { initializeTags, resetTags } from "./tags/tags-actions";
import {
  setLockedElementId,
  setOriginalPath,
  setSessionName,
} from "./workspace-metadata/workspace-metadata-actions";
import { getWorkspaceMetadataFromStore } from "./workspace-metadata/workspace-metadata-selectors";

/**
 * Notifies the user that there is a Zip in the loaded files
 */
const displayZipNotification = (zipCount: number) => {
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
const displayErrorNotification = (): ArchifiltreThunkAction => (dispatch) => {
  notifyError(
    translations.t("folderDropzone.errorsWhileLoading"),
    translations.t("folderDropzone.error"),
    NotificationDuration.PERMANENT,
    () => dispatch(openModalAction(Modal.FIlES_AND_FOLDERS_ERRORS_MODAL))
  );
};

const makeErrorResponse = () => ({
  terminate: noop,
  virtualFileSystem: Promise.reject(),
});

const displayRootPathError = () => {
  const errorMessage = translations.t("folderDropzone.errorsWhileLoading");
  const errorTitle = translations.t("folderDropzone.rootElementError");
  return displayError(errorMessage, errorTitle);
};

const displayInvalidPathError = () => {
  const errorMessage = translations.t("folderDropzone.cannotFindPath");
  const errorTitle = translations.t("folderDropzone.error");
  return displayError(errorMessage, errorTitle);
};

const displayUnexpectedError = (errorReason: string) => {
  const errorTitle = translations.t("folderDropzone.unexpectedError");
  const errorMessage = translations.t("folderDropzone.unexpectedErrorMessage");
  reportError(errorReason);
  notifyError(errorMessage, errorTitle, NotificationDuration.PERMANENT, () => {
    copyToClipboard(errorReason);
  });
};

const displayError = (errorMessage: string, errorTitle: string) => {
  notifyError(errorMessage, errorTitle);
  return makeErrorResponse();
};

/**
 * Handles tracking events sent to Matomo
 */
const handleTracking =
  (
    paths: string[],
    filesAndFoldersMap: FilesAndFoldersMap
  ): ArchifiltreThunkAction =>
  (dispatch, getState) => {
    const filesAndFoldersMetadataMap = getFilesAndFoldersMetadataFromStore(
      getState()
    );

    const treeVolume =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      filesAndFoldersMetadataMap[ROOT_FF_ID].childrenTotalSize ?? 0;

    const fileCount = paths.length;
    const foldersCount = Object.keys(filesAndFoldersMap).length - fileCount;

    const elementsByExtension = _(paths)
      .map((p) => path.extname(p))
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
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

const handleErrorNotificationDisplay =
  (): ArchifiltreThunkAction => (dispatch, getState) => {
    const errors = getErroredFilesAndFolders(getState());

    if (errors.length > 0) {
      void dispatch(displayErrorNotification());
    }
  };

const handleHashComputing =
  (virtualFileSystem: VirtualFileSystem): ArchifiltreThunkAction =>
  (dispatch) => {
    void dispatch(
      firstHashesComputingThunk(virtualFileSystem.originalPath, {
        ignoreFileHashes: !virtualFileSystem.isOnFileSystem,
      })
    );
  };

const handleNonJsonFileThunk =
  (
    fileOrFolderPath: string,
    virtualFileSystem: VirtualFileSystem
  ): ArchifiltreThunkAction =>
  (dispatch) => {
    if (!isJsonFile(fileOrFolderPath)) {
      const paths = getFiles(
        filesAndFoldersMapToArray(virtualFileSystem.filesAndFolders)
      ).map((file) => file.id);
      void dispatch(handleTracking(paths, virtualFileSystem.filesAndFolders));
      handleZipNotificationDisplay(paths);
      void dispatch(handleErrorNotificationDisplay());
      void dispatch(handleHashComputing(virtualFileSystem));
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

const handleVirtualFileSystemThunk =
  (
    fileOrFolderPath: string,
    virtualFileSystem: VirtualFileSystem
  ): ArchifiltreThunkAction =>
  (dispatch) => {
    handleJsonNotificationDisplay(fileOrFolderPath, virtualFileSystem);
    void dispatch(initStore(virtualFileSystem));
    dispatch(setLoadingStep(LoadingStep.FINISHED));
    dispatch(commitAction());
    void dispatch(handleNonJsonFileThunk(fileOrFolderPath, virtualFileSystem));
  };

const makeLoadFilesAndFoldersErrorHandler = (dispatch: ArchifiltreDispatch) =>
  tap<ErrorMessage>(({ error }) => {
    dispatch(registerErrorAction(error as ArchifiltreError));
    dispatch(registerErroredElements([error as ArchifiltreError]));
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
        break;
      default:
        break;
    }
  });

const loadFilesAndFoldersAfterInitThunk =
  (
    fileOrFolderPath: string,
    {
      filesAndFolders,
      erroredPaths,
    }: {
      filesAndFolders?: FilesAndFoldersMap;
      erroredPaths?: ArchifiltreError[];
    } = {}
  ): ArchifiltreThunkAction<VirtualFileSystemLoader> =>
  (dispatch) => {
    const { result$, terminate } = loadFileTree(fileOrFolderPath, {
      erroredPaths,
      filesAndFolders,
    });
    const virtualFileSystem = operateOnDataProcessingStream(
      result$ as Observable<ErrorMessage | ResultMessage<HookParam>>,
      {
        error: makeLoadFilesAndFoldersErrorHandler(
          dispatch
        ) as OperatorFunction<unknown, unknown>,
        result: makeLoadFilesAndFoldersResultHandler(dispatch),
      }
    )
      .pipe(filterResults<{ result: VirtualFileSystem }>())
      .toPromise()
      .then(({ result: { result } }) => {
        void dispatch(handleVirtualFileSystemThunk(fileOrFolderPath, result));
        return result;
      });

    return {
      terminate,
      virtualFileSystem,
    };
  };

export const reloadFilesAndFoldersThunk =
  (): ArchifiltreThunkAction<VirtualFileSystemLoader> =>
  (dispatch, getState) => {
    const state = getState();
    const { originalPath } = getWorkspaceMetadataFromStore(state);
    const filesAndFolders = getFilesAndFoldersFromStore(state);
    const erroredPaths = getErroredFilesAndFolders(state);

    dispatch(resetErroredElements());

    return dispatch(
      loadFilesAndFoldersAfterInitThunk(originalPath, {
        erroredPaths,
        filesAndFolders,
      })
    );
  };

interface VirtualFileSystemLoader {
  virtualFileSystem: Promise<VirtualFileSystem>;
  terminate: () => void;
}

const tryLoadFilesAndFoldersAfterInitThunk =
  (fileOrFolderPath: string): ArchifiltreThunkAction<VirtualFileSystemLoader> =>
  (dispatch) => {
    try {
      return dispatch(loadFilesAndFoldersAfterInitThunk(fileOrFolderPath));
    } catch (error: unknown) {
      reportError(error);
      dispatch(setLoadingStep(LoadingStep.ERROR));
      return {
        terminate: noop,
        virtualFileSystem: Promise.reject(),
      };
    }
  };

const loadFilesAndFoldersFromValidPathThunk =
  (
    fileOrFolderPath: string
  ): ArchifiltreThunkAction<Promise<VirtualFileSystemLoader>> =>
  async (dispatch) => {
    await clearActionReplayFile();
    const loadingStart = new Date().getTime();
    const { virtualFileSystem, terminate } = dispatch(
      tryLoadFilesAndFoldersAfterInitThunk(fileOrFolderPath)
    );
    void virtualFileSystem.then(() => {
      handleLoadingTimeTracking(loadingStart);
    });
    return { terminate, virtualFileSystem };
  };

const createArchifiltreStoreThunkError = (
  code: ArchifiltreStoreThunkErrorCode,
  _reason?: string
): ArchifiltreError => ({
  code,
  filePath: "",
  reason: "",
  type: ArchifiltreErrorType.STORE_THUNK,
});

const failIfRootPath = (rootPath: string) => {
  if (isRootPath(rootPath)) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw createArchifiltreStoreThunkError(
      ArchifiltreStoreThunkErrorCode.ROOT_PATH
    );
  }
  return rootPath;
};

const failIfInvalidPath = (invalidPath: string) => {
  if (!isValidFolderPath(invalidPath)) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw createArchifiltreStoreThunkError(
      ArchifiltreStoreThunkErrorCode.INVALID_PATH
    );
  }
  return invalidPath;
};

const displayUnknownError = () => makeErrorResponse();

export const loadFilesAndFoldersFromPathThunk =
  (
    fileOrFolderPath: string
  ): ArchifiltreThunkAction<Promise<VirtualFileSystemLoader>> =>
  async (dispatch) => {
    try {
      const { virtualFileSystem, terminate } = await compose(
        async (pathToLoad) =>
          dispatch(loadFilesAndFoldersFromValidPathThunk(pathToLoad)),
        failIfInvalidPath,
        failIfRootPath
      )(fileOrFolderPath);

      virtualFileSystem.catch((err: ArchifiltreError) => {
        displayUnexpectedError(err.reason);
      });

      return { terminate, virtualFileSystem };
    } catch (err: unknown) {
      return await makeErrorHandler({
        [ArchifiltreStoreThunkErrorCode.ROOT_PATH]: displayRootPathError,
        [ArchifiltreStoreThunkErrorCode.INVALID_PATH]: displayInvalidPathError,
        default: displayUnknownError,
      })(err as ArchifiltreError);
    }
  };

/**
 * Initializes the store with the data extracted from the JSON object
 */
const initStore =
  ({
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    hashes,
    originalPath,
    overrideLastModified,
    sessionName,
    tags,
    virtualPathToIdMap,
  }: VirtualFileSystem): ArchifiltreThunkAction =>
  (dispatch) => {
    dispatch(initializeFilesAndFolders(filesAndFolders));
    dispatch(initFilesAndFoldersMetatada(filesAndFoldersMetadata));
    dispatch(setOriginalPath(originalPath));
    dispatch(setSessionName(sessionName || getFirstLevelName(filesAndFolders)));

    dispatch(initVirtualPathToIdMap(virtualPathToIdMap));
    dispatch(initOverrideLastModified(overrideLastModified));
    /* eslint-disable @typescript-eslint/no-unnecessary-condition */
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
    /* eslint-enable @typescript-eslint/no-unnecessary-condition */
  };

export const resetStoreThunk = (): ArchifiltreThunkAction => (dispatch) => {
  dispatch(resetTags());
  dispatch(resetLoadingAction());
  dispatch(resetLoadingState());
  dispatch(setLockedElementId(""));
  dispatch(setLoadingStep(LoadingStep.WAITING));
  dispatch(resetErroredElements());
  dispatch(commitAction());
  dispatch(resetOverrideLastModified());
  workerManager.clear();
};
