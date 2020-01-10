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
import { initializeTags } from "./tags/tags-actions";
import { TagMap } from "./tags/tags-types";

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

  const { set: setDatabase, setOriginalPath, setSessionName } = api.database;

  const hook = ({ status, count, totalCount }) => {
    setStatus(status);
    if (count) {
      setCount(count);
    }

    if (totalCount) {
      setTotalCount(totalCount);
    }
  };

  startToLoadFiles();

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
      setDatabase(virtualFileSystem);
    } else {
      setOriginalPath(virtualFileSystem.originalPath);
      setSessionName(virtualFileSystem.sessionName);
      dispatch(initStoreThunk(virtualFileSystem));
    }
    finishedToLoadFiles();
    api.undo.commit();

    if (!isJsonFile(fileOrFolderPath)) {
      const filesAndFolders = virtualFileSystem.files_and_folders;
      const paths = getFiles(filesAndFoldersMapToArray(filesAndFolders)).map(
        file => file.id
      );
      addTracker({
        title: ActionTitle.FILE_TREE_DROP,
        type: ActionType.TRACK_EVENT,
        value: `Files dropped: ${paths.length}`
      });
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

interface InitStoreThunkParam {
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes: HashesMap;
  tags: TagMap;
}

/**
 * Initializes the store with the data extracted from the JSON object
 * @param filesAndFolders
 * @param filesAndFoldersMetadata
 * @param hashesMap
 * @param tags
 */
export const initStoreThunk = ({
  filesAndFolders,
  filesAndFoldersMetadata,
  hashes,
  tags
}: InitStoreThunkParam): ArchifiltreThunkAction => dispatch => {
  dispatch(initializeFilesAndFolders(filesAndFolders));
  dispatch(initFilesAndFoldersMetatada(filesAndFoldersMetadata));
  dispatch(setFilesAndFoldersHashes(hashes));
  dispatch(initializeTags(tags));
};
