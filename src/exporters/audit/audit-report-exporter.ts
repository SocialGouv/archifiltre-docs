import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getElementsToDeleteFromStore,
  getFoldersCount,
  getMaxDepth,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import {
  countDuplicateFiles,
  countDuplicateFolders,
} from "util/duplicates/duplicates-util";
import {
  formatPathForUserSystem,
  octet2HumanReadableFormat,
} from "util/file-system/file-sys-util";
import { FileType } from "util/file-types/file-types-util";
import {
  AuditReportData,
  generateAuditReportDocx,
} from "./audit-report-generator";
import {
  countFileTypes,
  formatAuditReportDate,
  getBiggestFiles,
  getDuplicateFilesPercent,
  getDuplicateFoldersPercent,
  getDuplicatesWithTheBiggestSize,
  getDuplicatesWithTheMostCopy,
  getElementsToDelete,
  getExtensionsList,
  getHumanReadableDuplicateTotalSize,
  getLongestPathFile,
  getOldestFiles,
  percentFileTypes,
} from "./audit-report-values-computer";
import { HashesMap } from "reducers/hashes/hashes-types";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";
import fs from "fs";
import {
  NotificationDuration,
  notifyInfo,
  notifySuccess,
} from "util/notification/notifications-util";
import translations from "translations/translations";
import { openExternalElement } from "util/file-system/file-system-util";

const ROOT_ID = "";

export const computeAuditReportData = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  filesAndFoldersHashes: HashesMap,
  elementsToDelete: string[]
): AuditReportData => {
  const longestPathFile = getLongestPathFile(filesAndFolders);
  const fileTypesPercents = percentFileTypes(filesAndFolders);
  const fileTypesCounts = countFileTypes(filesAndFolders);
  const extensionsList = getExtensionsList();
  return {
    totalFoldersCount: getFoldersCount(filesAndFolders),
    totalFilesCount: getFileCount(filesAndFolders),
    totalSize: octet2HumanReadableFormat(
      filesAndFoldersMetadata[ROOT_ID].childrenTotalSize
    ),
    oldestDate: formatAuditReportDate(
      filesAndFoldersMetadata[ROOT_ID].minLastModified
    ),
    newestDate: formatAuditReportDate(
      filesAndFoldersMetadata[ROOT_ID].maxLastModified
    ),
    longestPathLength: longestPathFile?.id?.length || 0,
    longestPathFileName: longestPathFile?.name || "",
    longestPathPath: formatPathForUserSystem(longestPathFile?.id) || "",
    depth: getMaxDepth(filesAndFolders),
    publicationPercent: fileTypesPercents[FileType.PUBLICATION],
    publicationCount: fileTypesCounts[FileType.PUBLICATION],
    publicationFileTypes: extensionsList[FileType.PUBLICATION],
    presentationPercent: fileTypesPercents[FileType.PRESENTATION],
    presentationCount: fileTypesCounts[FileType.PRESENTATION],
    presentationFileTypes: extensionsList[FileType.PRESENTATION],
    spreadsheetPercent: fileTypesPercents[FileType.SPREADSHEET],
    spreadsheetCount: fileTypesCounts[FileType.SPREADSHEET],
    spreadsheetFileTypes: extensionsList[FileType.SPREADSHEET],
    emailPercent: fileTypesPercents[FileType.EMAIL],
    emailCount: fileTypesCounts[FileType.EMAIL],
    emailFileTypes: extensionsList[FileType.EMAIL],
    documentPercent: fileTypesPercents[FileType.DOCUMENT],
    documentCount: fileTypesCounts[FileType.DOCUMENT],
    documentFileTypes: extensionsList[FileType.DOCUMENT],
    imagePercent: fileTypesPercents[FileType.IMAGE],
    imageCount: fileTypesCounts[FileType.IMAGE],
    imageFileTypes: extensionsList[FileType.IMAGE],
    videoPercent: fileTypesPercents[FileType.VIDEO],
    videoCount: fileTypesCounts[FileType.VIDEO],
    videoFileTypes: extensionsList[FileType.VIDEO],
    audioPercent: fileTypesPercents[FileType.AUDIO],
    audioCount: fileTypesCounts[FileType.AUDIO],
    audioFileTypes: extensionsList[FileType.AUDIO],
    otherPercent: fileTypesPercents[FileType.OTHER],
    otherCount: fileTypesCounts[FileType.OTHER],
    otherFileTypes: "les types restants",
    oldestFiles: getOldestFiles(filesAndFolders),
    biggestFiles: getBiggestFiles(filesAndFolders),
    duplicateFolderCount: countDuplicateFolders(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateFolderPercent: getDuplicateFoldersPercent(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateFileCount: countDuplicateFiles(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateFilePercent: getDuplicateFilesPercent(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateTotalSize: getHumanReadableDuplicateTotalSize(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicates: getDuplicatesWithTheMostCopy(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    biggestDuplicateFolders: getDuplicatesWithTheBiggestSize(
      filesAndFolders,
      filesAndFoldersMetadata,
      filesAndFoldersHashes
    ),
    elementsToDelete: getElementsToDelete(
      filesAndFolders,
      filesAndFoldersMetadata,
      elementsToDelete
    ),
  };
};

/**
 * Thunk to export an audit
 * @param name - name of the output file
 */
export const auditReportExporterThunk = (
  name: string
): ArchifiltreThunkAction => async (dispatch, getState): Promise<void> => {
  notifyInfo(
    translations.t("export.auditReportStarted"),
    translations.t("export.auditReportTitle")
  );
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filesAndFolders = getFilesAndFoldersFromStore(getState());
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(
    getState()
  );
  const hashes = getHashesFromStore(getState());
  const elementsToDelete = getElementsToDeleteFromStore(getState());

  await fs.promises.writeFile(
    name,
    generateAuditReportDocx(
      computeAuditReportData(
        filesAndFolders,
        filesAndFoldersMetadata,
        hashes,
        elementsToDelete
      )
    )
  );

  notifySuccess(
    translations.t("export.auditReportSuccess"),
    translations.t("export.auditReportTitle"),
    NotificationDuration.NORMAL,
    () => openExternalElement(name)
  );
};
