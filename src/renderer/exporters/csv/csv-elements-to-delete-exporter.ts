import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import { translations } from "../../translations/translations";
import { getCsvExportParamsFromStore } from "../../utils/array-export";
import { handleFileExportThunk } from "../../utils/export";
import { notifyInfo, notifySuccess } from "../../utils/notifications";
import { generateCsvExport$ } from "./csv-exporter.controller";
import type { CsvExportData } from "./csv-exporter-types";

// Function to filter elements by deletion tags
const filterByDeletion = <T extends { children?: string[] }>(
  list: Record<string, T>,
  toDelete: string[]
): Record<string, T> => {
  const filteredList = Object.fromEntries(
    Object.entries(list).filter(([id, item]) => {
      if (!item) {
        console.warn(`Item with ID ${id} is undefined.`);
        return false;
      }
      // Always include the "" entry and items tagged for deletion
      return id === "" || toDelete.includes(id);
    })
  );

  // Ensure that all parents of items in the filtered list are also included
  Object.keys(filteredList).forEach((id) => {
    let currentId = id;
    while (currentId) {
      const parent = list[currentId];
      if (parent && !filteredList[currentId]) {
        filteredList[currentId] = parent;
      }
      // Break if we reach the root
      if (parent && parent.id === "") break;

      // Move to the next parent by traversing upwards in the hierarchy
      currentId = parent?.children?.[0]; // Assuming the first child path contains the parent ID
    }
  });

  return filteredList;
};

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
    const {
      filesAndFolders,
      filesAndFoldersMetadata,
      elementsToDelete: toDelete,
    } = exportData;

    // Filter the data to include only elements tagged for deletion
    const filteredFilesAndFolders = filterByDeletion(filesAndFolders, toDelete);

    const filteredData: CsvExportData = {
      ...exportData,
      filesAndFolders: filteredFilesAndFolders,
      filesAndFoldersMetadata: filesAndFoldersMetadata,
    };

    const totalProgress = Object.keys(filteredData.filesAndFolders).length + 1;
    const loaderMessage = translations.t("export.creatingElementsToDeleteCsv");
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
