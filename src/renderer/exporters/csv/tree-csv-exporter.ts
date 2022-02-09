import { handleFileExportThunk } from "@common/utils/export/export-util";
import { notifyInfo } from "@common/utils/notification/notifications-util";

import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import { getFilesAndFoldersFromStore } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { translations } from "../../translations/translations";
import { generateTreeCsvExport$ } from "./tree-csv-exporter.controller";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const treeCsvExporterThunk =
  (name: string): ArchifiltreDocsThunkAction =>
  async (dispatch, getState) => {
    const csvExportStartedMessage = translations.t(
      "export.csvExportStartedMessage"
    );
    const exportNotificationTitle = translations.t("export.csvExportTitle");
    notifyInfo(csvExportStartedMessage, exportNotificationTitle);

    const state = getState();
    const filesAndFolders = getFilesAndFoldersFromStore(state);
    // We remove the root element and add the header line
    const totalProgress = Object.keys(filesAndFolders).length;
    const loaderMessage = translations.t("export.creatingTreeCsvExport");
    const loadedMessage = translations.t("export.createdTreeCsvExport");
    const exportSuccessMessage = translations.t(
      "export.csvExportSuccessMessage"
    );

    const treeCsvExportData$ = generateTreeCsvExport$(filesAndFolders);

    await dispatch(
      handleFileExportThunk(treeCsvExportData$, {
        exportFileName: name,
        exportNotificationTitle,
        exportSuccessMessage,
        loadedMessage,
        loaderMessage,
        totalProgress,
      })
    );
  };
