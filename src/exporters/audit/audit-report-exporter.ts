import { octet2HumanReadableFormat } from "../../components/main-space/ruler";
import { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
  getHashesFromStore,
  getMaxDepth
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFoldersMap,
  HashesMap
} from "../../reducers/files-and-folders/files-and-folders-types";
import {
  countDuplicateFiles,
  countDuplicateFolders
} from "../../util/duplicates-util";
import { saveBlob } from "../../util/file-sys-util";
import { FileType } from "../../util/file-types-util";
import {
  AuditReportData,
  generateAuditReportDocx
} from "./audit-report-generator";
import {
  countFileTypes,
  formatAuditReportDate,
  getBiggestFiles,
  getDuplicateFilesPercent,
  getDuplicateFoldersPercent,
  getDuplicatesWithTheBiggestSize,
  getDuplicatesWithTheMostCopy,
  getExtensionsList,
  getHumanReadableDuplicateTotalSize,
  getLongestPathFile,
  getOldestFiles,
  percentFileTypes
} from "./audit-report-values-computer";

const ROOT_ID = "";

// tslint:disable:object-literal-sort-keys
export const computeAuditReportData = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  filesAndFoldersHashes: HashesMap
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
  longestPathPath: getLongestPathFile(filesAndFolders)?.id || "",
  depth: getMaxDepth(filesAndFolders),
  presentationPercent: percentFileTypes(filesAndFolders)[FileType.PRESENTATION],
  presentationCount: countFileTypes(filesAndFolders)[FileType.PRESENTATION],
  presentationFileTypes: getExtensionsList()[FileType.PRESENTATION],
  documentPercent: percentFileTypes(filesAndFolders)[FileType.DOCUMENT],
  documentCount: countFileTypes(filesAndFolders)[FileType.DOCUMENT],
  documentFileTypes: getExtensionsList()[FileType.DOCUMENT],
  spreadsheetPercent: percentFileTypes(filesAndFolders)[FileType.SPREADSHEET],
  spreadsheetCount: countFileTypes(filesAndFolders)[FileType.SPREADSHEET],
  spreadsheetFileTypes: getExtensionsList()[FileType.SPREADSHEET],
  emailPercent: percentFileTypes(filesAndFolders)[FileType.EMAIL],
  emailCount: countFileTypes(filesAndFolders)[FileType.EMAIL],
  emailFileTypes: getExtensionsList()[FileType.EMAIL],
  mediaPercent: percentFileTypes(filesAndFolders)[FileType.MEDIA],
  mediaCount: countFileTypes(filesAndFolders)[FileType.MEDIA],
  mediaFileTypes: getExtensionsList()[FileType.MEDIA],
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
  biggestDuplicateFiles: getDuplicatesWithTheBiggestSize(
    filesAndFolders,
    filesAndFoldersHashes
  )
});
// tslint:enable:object-literal-sort-keys

/**
 * Thunk to export an audit
 * @param name - name of the output file
 */
export const auditReportExporterThunk = (
  name: string
): ArchifiltreThunkAction => (dispatch, getState) => {
  const filesAndFolders = getFilesAndFoldersFromStore(getState());
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(
    getState()
  );
  const hashes = getHashesFromStore(getState());
  saveBlob(
    name,
    generateAuditReportDocx(
      computeAuditReportData(filesAndFolders, filesAndFoldersMetadata, hashes)
    )
  );
};
