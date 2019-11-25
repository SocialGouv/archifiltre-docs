import dateFormat from "dateformat";
import { octet2HumanReadableFormat } from "../../components/ruler";
import { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
  getMaxDepth
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { saveBlob } from "../../util/file-sys-util";
import { FileType } from "../../util/file-types-util";
import {
  AuditReportData,
  generateAuditReportDocx
} from "./audit-report-generator";
import {
  countFileTypes,
  getExtensionsList,
  getLongestPathFile,
  percentFileTypes
} from "./audit-report-values-computer";

const ROOT_ID = "";

const formatAuditReportDate = (timestamp: number): string =>
  dateFormat(timestamp, "dd/mm/yyyy");

// tslint:disable:object-literal-sort-keys
export const computeAuditReportData = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
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
  oldestFiles: [
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    }
  ],
  biggestFiles: [
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    }
  ],
  duplicateFolderCount: 10,
  duplicateFolderPercent: 10,
  duplicateFileCount: 10,
  duplicateFilePercent: 10,
  duplicateTotalSize: "2Go",
  duplicates: [
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    }
  ],
  biggestDuplicateFiles: [
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    }
  ]
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
  saveBlob(
    name,
    generateAuditReportDocx(
      computeAuditReportData(filesAndFolders, filesAndFoldersMetadata)
    )
  );
};
