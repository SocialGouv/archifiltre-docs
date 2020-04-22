import { shell } from "electron";
import { promises as fs } from "fs";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getFilesToDeleteFromStore,
  getHashesFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { from } from "rxjs";
import { bufferTime, flatMap, last, tap } from "rxjs/operators";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "reducers/loading-info/loading-info-actions";
import { startLoading } from "reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import translations from "translations/translations";
import { promptUserForSave } from "util/file-system/file-system-util";
import {
  NotificationDuration,
  notifyInfo,
  notifySuccess,
} from "util/notification/notifications-util";
import {
  generateCsvExport$,
  GenerateCsvExportOptions,
} from "./csv-exporter.controller";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const csvExporterThunk = (
  name: string,
  { withHashes = false } = {}
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const exportFilePath = await promptUserForSave(name);

  if (!exportFilePath) {
    return;
  }

  addTracker({
    title: ActionTitle.CSV_EXPORT,
    type: ActionType.TRACK_EVENT,
  });

  const csvExportStartedMessage = translations.t(
    "export.csvExportStartedMessage"
  );
  const csvExportTitle = translations.t("export.csvExportTitle");
  notifyInfo(csvExportStartedMessage, csvExportTitle);

  const state = getState();
  const tags = getTagsFromStore(state);
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);
  const hashes = getHashesFromStore(state);
  const comments = getCommentsFromStore(state);
  const aliases = getAliasesFromStore(state);
  const elementsToDelete = getFilesToDeleteFromStore(state);

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

  const nbFilesAndFolders = Object.keys(filesAndFolders).length;
  const creatingCsvExportMessage = withHashes
    ? translations.t("export.creatingCsvExportWithHashes")
    : translations.t("export.creatingCsvExport");
  const loadingId = dispatch(
    startLoading(
      LoadingInfoTypes.EXPORT,
      nbFilesAndFolders,
      creatingCsvExportMessage
    )
  );

  const LOADING_BAR_UPDATE_INTERVAL = 1000;

  const csvExportData$ = generateCsvExport$(data);
  await new Promise((resolve) => {
    csvExportData$
      .pipe(bufferTime(LOADING_BAR_UPDATE_INTERVAL))
      .pipe(
        tap((buffer) =>
          dispatch(progressLoadingAction(loadingId, buffer.length))
        )
      )
      .pipe(flatMap((buffer) => from(buffer)))
      .pipe(last())
      .subscribe({
        next: async (csv: string) => {
          dispatch(completeLoadingAction(loadingId));
          await fs.writeFile(exportFilePath, csv, { encoding: "utf-8" });
          const csvExportSuccessMessage = translations.t(
            "export.csvExportSuccessMessage"
          );
          notifySuccess(
            csvExportSuccessMessage,
            csvExportTitle,
            NotificationDuration.NORMAL,
            () => shell.openItem(exportFilePath)
          );
          resolve();
        },
      });
  });
};
