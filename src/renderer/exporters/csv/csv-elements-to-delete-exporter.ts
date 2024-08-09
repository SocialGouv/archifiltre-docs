import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import { translations } from "../../translations/translations";
import { getCsvExportParamsFromStore } from "../../utils/array-export";
import { handleFileExportThunk } from "../../utils/export";
import { notifyInfo } from "../../utils/notifications";
import { generateElementsToDeleteArrayExport$ } from "../../utils/array-export/array-export";
import type { CsvExportData } from "./csv-exporter-types";

/**
 * Thunk that generates the CSV export with only the elements tagged for deletion.
 */
export const csvElementsToDeleteExporterThunk =
  (name: string, { withHashes = false } = {}): ArchifiltreDocsThunkAction =>
  (dispatch, getState) => {
    const csvExportStartedMessage = translations.t(
      "export.elementsToDeleteExportStartedMessage"
    );
    const exportNotificationTitle = translations.t(
      "export.elementsToDeleteExportTitle"
    );
    notifyInfo(csvExportStartedMessage, exportNotificationTitle);

    const exportData: CsvExportData = getCsvExportParamsFromStore(getState());

    if (!withHashes) {
      delete exportData.hashes;
    }

    const totalProgress = Object.keys(exportData.filesAndFolders).length + 1;
    const loaderMessage = translations.t("export.creatingElementsToDeleteCsv");
    const loadedMessage = translations.t("export.createdElementsToDeleteCsv");

    const exportSuccessMessage = translations.t(
      "export.elementsToDeleteExportSuccessMessage"
    );

    // Generate the filtered CSV export observable (elements to delete only)
    const csvExportData$ = generateElementsToDeleteArrayExport$(exportData);

    // Dispatch the file export process
    return dispatch(
      handleFileExportThunk(csvExportData$, {
        exportFileName: name,
        exportNotificationTitle,
        exportSuccessMessage,
        loadedMessage,
        loaderMessage,
        totalProgress,
      })
    );
  };
