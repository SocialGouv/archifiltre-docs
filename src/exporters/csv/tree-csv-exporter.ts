import { generateTreeCsvExport$ } from "exporters/csv/tree-csv-exporter.controller";
import type { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import translations from "translations/translations";
import { handleFileExportThunk } from "util/export/export-util";
import { notifyInfo } from "util/notification/notifications-util";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const treeCsvExporterThunk =
    (name: string): ArchifiltreThunkAction =>
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
