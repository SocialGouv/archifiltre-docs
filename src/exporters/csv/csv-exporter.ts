import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getElementsToDeleteFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import translations from "translations/translations";
import { handleFileExportThunk } from "util/export/export-util";
import { notifyInfo } from "util/notification/notifications-util";
import {
  generateCsvExport$,
  GenerateCsvExportOptions,
} from "./csv-exporter.controller";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const csvExporterThunk = (
  name: string,
  { withHashes = false } = {}
): ArchifiltreThunkAction => async (dispatch, getState) => {
  addTracker({
    title: ActionTitle.CSV_EXPORT,
    type: ActionType.TRACK_EVENT,
  });

  const csvExportStartedMessage = translations.t(
    "export.csvExportStartedMessage"
  );
  const exportNotificationTitle = translations.t("export.csvExportTitle");
  notifyInfo(csvExportStartedMessage, exportNotificationTitle);

  const state = getState();
  const tags = getTagsFromStore(state);
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);
  const hashes = getHashesFromStore(state);
  const comments = getCommentsFromStore(state);
  const aliases = getAliasesFromStore(state);
  const elementsToDelete = getElementsToDeleteFromStore(state);

  const data: GenerateCsvExportOptions = {
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    hashes: undefined,
    tags,
  };

  if (withHashes) {
    data.hashes = hashes;
  }

  const totalProgress = Object.keys(filesAndFolders).length + 1;
  const loaderMessage = withHashes
    ? translations.t("export.creatingCsvExportWithHashes")
    : translations.t("export.creatingCsvExport");

  const exportSuccessMessage = translations.t("export.csvExportSuccessMessage");

  const csvExportData$ = generateCsvExport$(data);

  return dispatch(
    handleFileExportThunk(csvExportData$, {
      totalProgress,
      loaderMessage,
      exportNotificationTitle,
      exportFileName: name,
      exportSuccessMessage,
    })
  );
};
