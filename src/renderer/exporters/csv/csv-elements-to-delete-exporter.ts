import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import { translations } from "../../translations/translations";
import { getCsvExportParamsFromStore } from "../../utils/array-export";
import { handleFileExportThunk } from "../../utils/export";
import { notifyInfo, notifySuccess } from "../../utils/notifications";
import { generateCsvExport$ } from "./csv-exporter.controller";
import type { CsvExportData } from "./csv-exporter-types";

export const csvElementsToDeleteExporterThunk =
  (name: string): ArchifiltreDocsThunkAction =>
  (dispatch, getState) => {
    const exportStartedMessage = translations.t(
      "export.elementsToDeleteExportStartedMessage"
    );
    const exportNotificationTitle = translations.t(
      "export.elementsToDeleteExportTitle"
    );
    notifyInfo(exportStartedMessage, exportNotificationTitle);

    const state = getState();
    const exportData = getCsvExportParamsFromStore(state);

    // Use selectors to get elements tagged for deletion
    const filesAndFolders = exportData.filesAndFolders;
    const filesAndFoldersMetadata = exportData.filesAndFoldersMetadata;
    const toDelete = exportData.elementsToDelete;

    // Filter the data to include only elements tagged for deletion
    const filteredFilesAndFolders = Object.fromEntries(
      Object.entries(filesAndFolders).filter(([id, fileOrFolder]) => {
        // Ensure the fileOrFolder is defined
        if (!fileOrFolder) {
          console.warn(`File or folder with ID ${id} is undefined.`);
          return false;
        }
        // Include only those tagged for deletion
        return toDelete.includes(id);
      })
    );
    
    const filteredData: CsvExportData = {
      ...exportData,
      filesAndFolders: filteredFilesAndFolders,
      filesAndFoldersMetadata: filesAndFoldersMetadata
    };

    const totalProgress = Object.keys(filteredData.filesAndFolders).length + 1;
    const loaderMessage = translations.t(
      "export.creatingElementsToDeleteCsv"
    );
    const loadedMessage = translations.t("export.createdElementsToDeleteCsv");

    const exportSuccessMessage = translations.t(
      "export.elementsToDeleteExportSuccessMessage"
    );
    const csvExportData$ = generateCsvExport$(filteredData);

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
