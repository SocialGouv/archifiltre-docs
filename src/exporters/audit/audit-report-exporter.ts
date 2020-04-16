import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFilesToDeleteFromStore,
  getFoldersCount,
  getHashesFromStore,
  getMaxDepth,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFoldersMap,
  HashesMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import {
  countDuplicateFiles,
  countDuplicateFolders,
} from "../../util/duplicates-util";
import {
  formatPathForUserSystem,
  octet2HumanReadableFormat,
  saveBlob,
} from "../../util/file-sys-util";
import { FileType } from "../../util/file-types-util";
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

const ROOT_ID = "";

// tslint:disable:object-literal-sort-keys
export const computeAuditReportData = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  filesAndFoldersHashes: HashesMap,
  elementsToDelete: string[]
): AuditReportData => ({
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
  longestPathLength: getLongestPathFile(filesAndFolders)?.id?.length || 0,
  longestPathFileName: getLongestPathFile(filesAndFolders)?.name || "",
  longestPathPath:
    formatPathForUserSystem(getLongestPathFile(filesAndFolders)?.id) || "",
  depth: getMaxDepth(filesAndFolders),
  publicationPercent: percentFileTypes(filesAndFolders)[FileType.PUBLICATION],
  publicationCount: countFileTypes(filesAndFolders)[FileType.PUBLICATION],
  publicationFileTypes: getExtensionsList()[FileType.PUBLICATION],
  presentationPercent: percentFileTypes(filesAndFolders)[FileType.PRESENTATION],
  presentationCount: countFileTypes(filesAndFolders)[FileType.PRESENTATION],
  presentationFileTypes: getExtensionsList()[FileType.PRESENTATION],
  spreadsheetPercent: percentFileTypes(filesAndFolders)[FileType.SPREADSHEET],
  spreadsheetCount: countFileTypes(filesAndFolders)[FileType.SPREADSHEET],
  spreadsheetFileTypes: getExtensionsList()[FileType.SPREADSHEET],
  emailPercent: percentFileTypes(filesAndFolders)[FileType.EMAIL],
  emailCount: countFileTypes(filesAndFolders)[FileType.EMAIL],
  emailFileTypes: getExtensionsList()[FileType.EMAIL],
  documentPercent: percentFileTypes(filesAndFolders)[FileType.DOCUMENT],
  documentCount: countFileTypes(filesAndFolders)[FileType.DOCUMENT],
  documentFileTypes: getExtensionsList()[FileType.DOCUMENT],
  imagePercent: percentFileTypes(filesAndFolders)[FileType.IMAGE],
  imageCount: countFileTypes(filesAndFolders)[FileType.IMAGE],
  imageFileTypes: getExtensionsList()[FileType.IMAGE],
  videoPercent: percentFileTypes(filesAndFolders)[FileType.VIDEO],
  videoCount: countFileTypes(filesAndFolders)[FileType.VIDEO],
  videoFileTypes: getExtensionsList()[FileType.VIDEO],
  audioPercent: percentFileTypes(filesAndFolders)[FileType.AUDIO],
  audioCount: countFileTypes(filesAndFolders)[FileType.AUDIO],
  audioFileTypes: getExtensionsList()[FileType.AUDIO],
  otherPercent: percentFileTypes(filesAndFolders)[FileType.OTHER],
  otherCount: countFileTypes(filesAndFolders)[FileType.OTHER],
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
});
// tslint:enable:object-literal-sort-keys

/**
 * Thunk to export an audit
 * @param name - name of the output file
 */
export const auditReportExporterThunk = (
  name: string
): ArchifiltreThunkAction => (dispatch, getState) => {
  addTracker({
    title: ActionTitle.AUDIT_REPORT_EXPORT,
    type: ActionType.TRACK_EVENT,
  });
  const filesAndFolders = getFilesAndFoldersFromStore(getState());
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(
    getState()
  );
  const hashes = getHashesFromStore(getState());
  const elementsToDelete = getFilesToDeleteFromStore(getState());
  saveBlob(
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
};
