import _, { keyBy } from "lodash";
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
  initializeFilesAndFolders,
  setFilesAndFoldersHashes
} from "./files-and-folders/files-and-folders-actions";
import {
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
    const jsonVersion = mapToNewVersionNumbers(`${virtualFileSystem.version}`);
    const currentVersion = mapToNewVersionNumbers(version);
    if (
      isJsonFile(fileOrFolderPath) &&
      versionComparator(jsonVersion, currentVersion) !== 0
    ) {
      displayJsonNotification();
    }
    if (!isJsonFile(fileOrFolderPath)) {
      dispatch(initStoreFromVirtualFileSystemThunk(virtualFileSystem));
    } else {
      dispatch(initStoreFromJsonThunk(virtualFileSystem));
    }
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
      const filesAndFolders = virtualFileSystem.files_and_folders;
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

      dispatch(computeHashesThunk(virtualFileSystem.original_path));
    }
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
    api.loading_state.errorLoadingFiles();
  }
};

interface VirtualFileSystemFilesAndFolders {
  alias: string;
  children: string[];
  comments: string;
  depth: number;
  name: string;
  file_size: number;
  file_last_modified: number;
  size: number;
  last_modified_average: number;
  last_modified_max: number;
  last_modified_median: number;
  last_modified_min: number;
  nb_files: number;
  sort_by_size_index: number[];
  sort_by_date_index: number[];
}

interface VirtualFileSystemFilesAndFoldersMap {
  [id: string]: VirtualFileSystemFilesAndFolders;
}

interface VirtualFileSystem {
  files_and_folders: VirtualFileSystemFilesAndFoldersMap;
  tags: TagMap;
  session_name: string;
  original_path: string;
}

const initStoreFromVirtualFileSystemThunk = ({
  files_and_folders: filesAndFolders,
  original_path: originalPath,
  tags
}: VirtualFileSystem): ArchifiltreThunkAction => dispatch => {
  dispatch(initializeTags(tags));
  const formattedFilesAndFolders = Object.entries(filesAndFolders).map(
    ([
      id,
      { name, alias, comments, children, file_size, file_last_modified }
    ]) => ({
      alias,
      children,
      comments,
      file_last_modified,
      file_size,
      hash: null,
      id,
      name
    })
  );
  const transformedFilesAndFolders = keyBy(formattedFilesAndFolders, "id");
  dispatch(initializeFilesAndFolders(transformedFilesAndFolders));

  const formattedMetadata = Object.entries(filesAndFolders).map(([id, ff]) => ({
    averageLastModified: ff.last_modified_average,
    childrenTotalSize: ff.size,
    id,
    maxLastModified: ff.last_modified_max,
    medianLastModified: ff.last_modified_median,
    minLastModified: ff.last_modified_min,
    nbChildrenFiles: ff.nb_files,
    sortByDateIndex: ff.sort_by_date_index,
    sortBySizeIndex: ff.sort_by_size_index
  }));

  const transformedMetadata = keyBy(formattedMetadata, "id");

  dispatch(initFilesAndFoldersMetatada(transformedMetadata));
  dispatch(setOriginalPath(originalPath));
  dispatch(setSessionName(translations.t("common.projectName")));
};

interface InitStoreThunkParam {
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
const initStoreFromJsonThunk = ({
  filesAndFolders,
  filesAndFoldersMetadata,
  hashes,
  originalPath,
  sessionName,
  tags
}: InitStoreThunkParam): ArchifiltreThunkAction => dispatch => {
  dispatch(initializeFilesAndFolders(filesAndFolders));
  dispatch(initFilesAndFoldersMetatada(filesAndFoldersMetadata));
  dispatch(setFilesAndFoldersHashes(hashes));
  dispatch(setOriginalPath(originalPath));
  dispatch(setSessionName(sessionName));
  dispatch(initializeTags(tags));
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
