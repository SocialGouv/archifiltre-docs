import { generateTreeCsvExport$ } from "exporters/csv/tree-csv-exporter.controller";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import translations from "translations/translations";
import { handleFileExportThunk } from "util/export/export-util";
import { notifyInfo } from "util/notification/notifications-util";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const treeCsvExporterThunk = (
  name: string
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
  const filesAndFolders = getFilesAndFoldersFromStore(state);

  const totalProgress = Object.keys(filesAndFolders).length;
  const loaderMessage = translations.t("export.creatingTreeCsvExport");
  const exportSuccessMessage = translations.t("export.csvExportSuccessMessage");

  const treeCsvExportData$ = generateTreeCsvExport$(filesAndFolders);

  return dispatch(
    handleFileExportThunk(treeCsvExportData$, {
      totalProgress,
      loaderMessage,
      exportNotificationTitle,
      exportFileName: name,
      exportSuccessMessage,
    })
  );
};
