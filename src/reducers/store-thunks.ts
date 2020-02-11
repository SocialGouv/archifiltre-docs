import _ from "lodash";
import path from "path";
import AsyncHandleDrop from "../async-handle-drop";
import { mapToNewVersionNumbers } from "../components/header/a-new-version-is-available";
import { computeHashesThunk } from "../hash-computer/hash-computer-thunk";
import { addTracker } from "../logging/tracker";
import { ActionTitle, ActionType } from "../logging/tracker-types";
import translations from "../translations/translations";
import {
  filesAndFoldersMapToArray,
  getFiles
} from "../util/file-and-folders-utils";
import { countZipFiles, isJsonFile } from "../util/file-sys-util";
import { NotificationDuration, notifyInfo } from "../util/notifications-util";
import { wait } from "../util/promise-util";
import version, { versionComparator } from "../version";
import { ArchifiltreThunkAction } from "./archifiltre-types";
import { initFilesAndFoldersMetatada } from "./files-and-folders-metadata/files-and-folders-metadata-actions";
import { FilesAndFoldersMetadataMap } from "./files-and-folders-metadata/files-and-folders-metadata-types";
import {
  addCommentsOnFilesAndFolders,
  initializeFilesAndFolders,
  setFilesAndFoldersAliases,
  setFilesAndFoldersHashes
} from "./files-and-folders/files-and-folders-actions";
import {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
  HashesMap
} from "./files-and-folders/files-and-folders-types";
import { resetLoadingAction } from "./loading-info/loading-info-actions";
import { clearActionReplayFile } from "./middleware/persist-actions-middleware";
import { initializeTags, resetTags } from "./tags/tags-actions";
import { TagMap } from "./tags/tags-types";
import {
  setOriginalPath,
  setSessionName
} from "./workspace-metadata/workspace-metadata-actions";

/**
 * Notifies the user that there is a Zip in the loaded files
 * @param zipCount - The number of zip files detected
 */
const displayZipNotification = zipCount => {
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
 * Handles tracking events sent to Matomo
 * @param paths of files that need to be tracked
 */
const handleTracking = paths => {
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
    value: elementsByExtension
  });
};

/**
 * Loads a files
 * @param fileOrFolderPath
 * @param api - The real estate api. Will be removed with real estate.
 */
export const loadFilesAndFoldersFromPathThunk = (
  fileOrFolderPath: string,
  { api }: any
): ArchifiltreThunkAction => async dispatch => {
  const {
    startToLoadFiles,
    setStatus,
    setCount,
    setTotalCount,
    finishedToLoadFiles
  } = api.loading_state;

  const hook = ({ status, count, totalCount }) => {
    setStatus(status);
    if (count) {
      setCount(count);
    }

    if (totalCount) {
      setTotalCount(totalCount);
    }
  };

  await clearActionReplayFile();

  startToLoadFiles();
  const loadingStart = new Date().getTime();
  try {
    const virtualFileSystem = await AsyncHandleDrop(hook, fileOrFolderPath);

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
    finishedToLoadFiles();
    const loadingEnd = new Date().getTime();
    const loadingTime = `${(loadingEnd - loadingStart) / 1000}s`; // Loading time in seconds
    addTracker({
      eventValue: loadingTime,
      title: ActionTitle.LOADING_TIME,
      type: ActionType.TRACK_EVENT,
      value: `Loading time: ${loadingTime}`
    });
    api.undo.commit();

    if (!isJsonFile(fileOrFolderPath)) {
      const filesAndFolders = virtualFileSystem.filesAndFolders;
      const paths = getFiles(filesAndFoldersMapToArray(filesAndFolders)).map(
        file => file.id
      );
      handleTracking(paths);
      const zipFileCount = countZipFiles(paths);
      if (zipFileCount > 0) {
        displayZipNotification(zipFileCount);
      }

      // We defer the thunk execution to wait for the real estate setters to complete
      // TODO: Remove this once real estate setters are no longer used
      await wait();

      dispatch(computeHashesThunk(virtualFileSystem.originalPath));
    }
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
    api.loading_state.errorLoadingFiles();
  }
};

interface InitStoreThunkParam {
  aliases: AliasMap;
  comments: CommentsMap;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes: HashesMap;
  originalPath: string;
  sessionName: string;
  tags: TagMap;
}

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
  filesAndFolders,
  filesAndFoldersMetadata,
  hashes,
  originalPath,
  sessionName,
  tags
}: InitStoreThunkParam): ArchifiltreThunkAction => dispatch => {
  dispatch(initializeFilesAndFolders(filesAndFolders));
  dispatch(initFilesAndFoldersMetatada(filesAndFoldersMetadata));
  dispatch(setOriginalPath(originalPath));
  dispatch(setSessionName(sessionName || translations.t("common.projectName")));

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
};

export const resetStoreThunk = (
  api: any
): ArchifiltreThunkAction => dispatch => {
  const { loading_state, icicle_state, undo } = api;
  dispatch(resetTags());
  dispatch(resetLoadingAction());
  loading_state.reInit();
  icicle_state.reInit();
  icicle_state.setNoFocus();
  icicle_state.setNoDisplayRoot();
  undo.commit();
};
