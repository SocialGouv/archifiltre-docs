import _ from "lodash";
import path from "path";
import { mapToNewVersionNumbers } from "components/header/new-version-checker";
import { computeHashesThunk } from "hash-computer/hash-computer-thunk";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import translations from "translations/translations";
import {
  filesAndFoldersMapToArray,
  getFiles,
  getFirstLevelName,
} from "util/files-and-folders/file-and-folders-utils";
import {
  countZipFiles,
  isJsonFile,
  isRootPath,
} from "util/file-system/file-sys-util";
import {
  NotificationDuration,
  notifyError,
  notifyInfo,
} from "util/notification/notifications-util";
import version, { versionComparator } from "../version";
import { ArchifiltreThunkAction } from "./archifiltre-types";
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
import { ArchifiltreError } from "./loading-info/loading-info-types";
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
import { loadFileTree } from "util/file-tree-loader/file-tree-loader";
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

const displayRootPathError = () => () => {
  notifyError(
    translations.t("folderDropzone.errorsWhileLoading"),
    translations.t("folderDropzone.rootElementError")
  );
};

/**
 * Handles tracking events sent to Matomo
 * @param paths of files that need to be tracked
 */
const handleTracking = (paths) => {
  const elementsByExtension = _(paths)
    .map(path.extname)
    .countBy(_.identity())
    .map((count, extension) => `${extension || "[No extension]"}: ${count}`)
    .unshift(`Files dropped: ${paths.length}`)
    .join("; \r\n");

  addTracker({
    eventValue: paths.length,
    title: ActionTitle.FILE_TREE_DROP,
    type: ActionType.TRACK_EVENT,
    value: elementsByExtension,
  });
};

interface HookParam {
  status?: string | FileSystemLoadingStep;
  count?: number;
  totalCount?: number;
}

const defaultHookParam: HookParam = {};

/**
 * Loads a files
 * @param fileOrFolderPath
 */
export const loadFilesAndFoldersFromPathThunk = (
  fileOrFolderPath: string
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const hook = (
    error: ArchifiltreError | null,
    { status, count = 0 } = defaultHookParam
  ) => {
    if (error) {
      dispatch(registerErrorAction(error));
      return;
    }

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
  };

  if (isRootPath(fileOrFolderPath)) {
    dispatch(displayRootPathError());
    return;
  }

  await clearActionReplayFile();

  dispatch(setLoadingStep(LoadingStep.STARTED));
  const loadingStart = new Date().getTime();
  try {
    const virtualFileSystem = await loadFileTree(fileOrFolderPath, hook);

    if (isJsonFile(fileOrFolderPath)) {
      const jsonVersion = mapToNewVersionNumbers(
        `${virtualFileSystem.version}`
      );
      const currentVersion = mapToNewVersionNumbers(version);
      if (versionComparator(jsonVersion, currentVersion) !== 0) {
        displayJsonNotification();
      }
    }
    dispatch(initStore(virtualFileSystem));
    dispatch(setLoadingStep(LoadingStep.FINISHED));
    const loadingEnd = new Date().getTime();
    const loadingTime = `${(loadingEnd - loadingStart) / 1000}s`; // Loading time in seconds
    addTracker({
      eventValue: loadingTime,
      title: ActionTitle.LOADING_TIME,
      type: ActionType.TRACK_EVENT,
      value: `Loading time: ${loadingTime}`,
    });
    dispatch(commitAction());

    if (!isJsonFile(fileOrFolderPath)) {
      const filesAndFolders = virtualFileSystem.filesAndFolders;
      const paths = getFiles(filesAndFoldersMapToArray(filesAndFolders)).map(
        (file) => file.id
      );
      handleTracking(paths);
      const zipFileCount = countZipFiles(paths);
      if (zipFileCount > 0) {
        displayZipNotification(zipFileCount);
      }

      const errors = getArchifiltreErrors(getState());

      if (errors.length > 0) {
        dispatch(displayErrorNotification());
      }

      dispatch(
        computeHashesThunk(virtualFileSystem.originalPath, {
          ignoreFileHashes:
            virtualFileSystem.hashes !== null &&
            Object.keys(virtualFileSystem.hashes).length > 0,
        })
      );
    }
  } catch (error) {
    console.error(error);
    dispatch(setLoadingStep(LoadingStep.ERROR));
  }
};

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
