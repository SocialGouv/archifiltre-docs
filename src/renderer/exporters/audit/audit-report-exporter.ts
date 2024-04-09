import { type AnyFunction } from "@common/utils/function";
import { type HashesMap } from "@common/utils/hashes-types";
import { version } from "@common/utils/package";
import fs from "fs";

import { type ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import {
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
  getMaxDepth,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { type FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { type FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getHashesFromStore } from "../../reducers/hashes/hashes-selectors";
import { translations } from "../../translations/translations";
import { bytes2HumanReadableFormat, getCO2ByFileSize, getFilesCount, getFoldersCount } from "../../utils";
import { countDuplicateFiles, countDuplicateFolders } from "../../utils/duplicates";
import { formatPathForUserSystem } from "../../utils/file-system/file-sys-util";
import { openExternalElement } from "../../utils/file-system/file-system-util";
import { FileType } from "../../utils/file-types";
import { NotificationDuration, notifyInfo, notifySuccess } from "../../utils/notifications";
import { type AuditReportData, generateAuditReportDocx } from "./audit-report-generator";
import {
  countFileTypes,
  formatAuditReportDate,
  getBiggestFiles,
  getDuplicateFilesPercent,
  getDuplicateFoldersPercent,
  getDuplicatesWithTheBiggestSize,
  getDuplicatesWithTheMostCopy,
  getDuplicateTotalSize,
  getElementsToDelete,
  getExtensionsList,
  getLongestPathFile,
  getOldestFiles,
  percentFileTypes,
} from "./audit-report-values-computer";

const ROOT_ID = "";

export const computeAuditReportData = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  filesAndFoldersHashes: HashesMap,
  elementsToDelete: string[],
): AuditReportData => {
  const longestPathFile = getLongestPathFile(filesAndFolders);
  const fileTypesPercents = percentFileTypes(filesAndFolders);
  const fileTypesCounts = countFileTypes(filesAndFolders);
  const extensionsList = getExtensionsList();
  const totalSizeInBytes = filesAndFoldersMetadata[ROOT_ID].childrenTotalSize || 0;
  const totalCO2 = getCO2ByFileSize(totalSizeInBytes);
  const duplicateTotalSize = getDuplicateTotalSize(filesAndFolders, filesAndFoldersHashes);

  return {
    archifiltreVersion: version,
    audioCount: fileTypesCounts[FileType.AUDIO],
    audioFileTypes: extensionsList[FileType.AUDIO],
    audioPercent: fileTypesPercents[FileType.AUDIO],
    biggestDuplicateFolders: getDuplicatesWithTheBiggestSize(
      filesAndFolders,
      filesAndFoldersMetadata,
      filesAndFoldersHashes,
    ),
    biggestFiles: getBiggestFiles(filesAndFolders),
    depth: getMaxDepth(filesAndFolders),
    documentCount: fileTypesCounts[FileType.DOCUMENT],
    documentFileTypes: extensionsList[FileType.DOCUMENT],
    documentPercent: fileTypesPercents[FileType.DOCUMENT],
    duplicateFileCount: countDuplicateFiles(filesAndFolders, filesAndFoldersHashes),
    duplicateFilePercent: Math.round(getDuplicateFilesPercent(filesAndFolders, filesAndFoldersHashes) * 100),
    duplicateFolderCount: countDuplicateFolders(filesAndFolders, filesAndFoldersHashes),
    duplicateFolderPercent: Math.round(getDuplicateFoldersPercent(filesAndFolders, filesAndFoldersHashes) * 100),
    duplicateTotalCO2: getCO2ByFileSize(duplicateTotalSize),
    duplicateTotalSize: bytes2HumanReadableFormat(duplicateTotalSize),
    duplicates: getDuplicatesWithTheMostCopy(filesAndFolders, filesAndFoldersHashes),
    elementsToDelete: getElementsToDelete(filesAndFolders, filesAndFoldersMetadata, elementsToDelete),
    emailCount: fileTypesCounts[FileType.EMAIL],
    emailFileTypes: extensionsList[FileType.EMAIL],
    emailPercent: fileTypesPercents[FileType.EMAIL],
    imageCount: fileTypesCounts[FileType.IMAGE],
    imageFileTypes: extensionsList[FileType.IMAGE],
    imagePercent: fileTypesPercents[FileType.IMAGE],
    longestPathFileName: longestPathFile?.name ?? "",
    longestPathLength: longestPathFile?.id.length ?? 0,
    longestPathPath: longestPathFile?.id ? formatPathForUserSystem(longestPathFile.id) : "",
    newestDate: formatAuditReportDate(filesAndFoldersMetadata[ROOT_ID].maxLastModified ?? 0),
    oldestDate: formatAuditReportDate(filesAndFoldersMetadata[ROOT_ID].minLastModified ?? 0),
    oldestFiles: getOldestFiles(filesAndFolders),
    otherCount: fileTypesCounts[FileType.OTHER] + fileTypesCounts[FileType.ARCHIVE],
    otherFileTypes: "les types restants",
    otherPercent: fileTypesPercents[FileType.OTHER] + fileTypesPercents[FileType.ARCHIVE],
    presentationCount: fileTypesCounts[FileType.PRESENTATION],
    presentationFileTypes: extensionsList[FileType.PRESENTATION],
    presentationPercent: fileTypesPercents[FileType.PRESENTATION],
    publicationCount: fileTypesCounts[FileType.PUBLICATION],
    publicationFileTypes: extensionsList[FileType.PUBLICATION],
    publicationPercent: fileTypesPercents[FileType.PUBLICATION],
    spreadsheetCount: fileTypesCounts[FileType.SPREADSHEET],
    spreadsheetFileTypes: extensionsList[FileType.SPREADSHEET],
    spreadsheetPercent: fileTypesPercents[FileType.SPREADSHEET],
    totalCO2,
    totalFilesCount: getFilesCount(filesAndFolders),
    totalFoldersCount: getFoldersCount(filesAndFolders),
    totalSize: bytes2HumanReadableFormat(totalSizeInBytes),
    videoCount: fileTypesCounts[FileType.VIDEO],
    videoFileTypes: extensionsList[FileType.VIDEO],
    videoPercent: fileTypesPercents[FileType.VIDEO],
  };
};

/**
 * Thunk to export an audit
 * @param name - name of the output file
 */
export const auditReportExporterThunk =
  (name: string): ArchifiltreDocsThunkAction =>
  async (_dispatch: AnyFunction, getState): Promise<void> => {
    notifyInfo(translations.t("export.auditReportStarted"), translations.t("export.auditReportTitle"));
    await new Promise(resolve => setTimeout(resolve, 500));

    const filesAndFolders = getFilesAndFoldersFromStore(getState());
    const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(getState());
    const hashes = getHashesFromStore(getState());
    const elementsToDelete = getElementsToDeleteFromStore(getState());

    await fs.promises.writeFile(
      name,
      generateAuditReportDocx(
        computeAuditReportData(filesAndFolders, filesAndFoldersMetadata, hashes, elementsToDelete),
      ),
    );

    notifySuccess(
      translations.t("export.auditReportSuccess"),
      translations.t("export.auditReportTitle"),
      NotificationDuration.NORMAL,
      async () => openExternalElement(name),
    );
  };
