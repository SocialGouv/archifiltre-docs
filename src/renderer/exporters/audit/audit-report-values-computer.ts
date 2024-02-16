import type {
  Accessor,
  Mapper,
  Merger,
} from "@common/utils/functionnal-programming";
import type { HashesMap } from "@common/utils/hashes-types";
import { curriedToDecimalFloat, getPercentage } from "@common/utils/numbers";
import dateFormat from "dateformat";
import _ from "lodash";
import {
  compose,
  countBy,
  defaults,
  groupBy,
  head,
  identity,
  join,
  map,
  mapValues,
  reverse,
  sortBy,
  sum,
  sumBy,
  take,
  takeRight,
} from "lodash/fp";

import type { FilesAndFoldersCollection } from "../../reducers/files-and-folders/files-and-folders-selectors";
import {
  getFiles,
  isFile,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import type {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import type {
  FilesAndFoldersMetadata,
  FilesAndFoldersMetadataMap,
} from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { translations } from "../../translations/translations";
import {
  countDuplicateFilesTotalSize,
  countDuplicatesPercentForFiles,
  countDuplicatesPercentForFolders,
  getBiggestDuplicatedFolders,
  getMostDuplicatedFiles,
} from "../../utils/duplicates";
import {
  bytes2HumanReadableFormat,
  formatPathForUserSystem,
} from "../../utils/file-system/file-sys-util";
import {
  FileType,
  getExtensionsForEachFileType,
  getFileType,
} from "../../utils/file-types";
import type {
  AuditReportElementWithType,
  AuditReportFileWithCount,
  AuditReportFileWithDate,
  AuditReportFileWithSize,
} from "./audit-report-generator";

export type FileTypeMap<T> = {
  [key in FileType]: T;
};
/**
 * Formats the date to the expect audit report format
 */
export const formatAuditReportDate = (timestamp: number): string =>
  dateFormat(timestamp, "dd/mm/yyyy");

/**
 * Sorts a FilesAndFoldersMap or FilesAndFolders[] by path length in a descending order.
 */
const sortFilesAndFoldersByPathLength: Mapper<
  FilesAndFoldersCollection,
  FilesAndFolders[]
> = sortBy((fileOrFolder: FilesAndFolders) => -fileOrFolder.id.length);

/**
 * Gets the file with the longest path
 */
export const getLongestPathFile: Mapper<
  FilesAndFoldersCollection,
  FilesAndFolders | undefined
> = compose(head, sortFilesAndFoldersByPathLength);

/**
 * Gets the number of files of every types
 */
export const countFileTypes: Mapper<
  FilesAndFoldersCollection,
  FileTypeMap<number>
> = compose(
  defaults({
    [FileType.ARCHIVE]: 0,
    [FileType.AUDIO]: 0,
    [FileType.DATA]: 0,
    [FileType.DOCUMENT]: 0,
    [FileType.EMAIL]: 0,
    [FileType.IMAGE]: 0,
    [FileType.OTHER]: 0,
    [FileType.PRESENTATION]: 0,
    [FileType.PUBLICATION]: 0,
    [FileType.SPREADSHEET]: 0,
    [FileType.VIDEO]: 0,
    [FileType.WEB]: 0,
  }),
  countBy(identity),
  map(getFileType),
  Object.values,
  getFiles
);

/**
 * Gets the sizes of files of every types
 */
export const countFileSizes: Mapper<
  FilesAndFoldersCollection,
  FileTypeMap<number>
> = compose(
  defaults({
    [FileType.ARCHIVE]: 0,
    [FileType.AUDIO]: 0,
    [FileType.DATA]: 0,
    [FileType.DOCUMENT]: 0,
    [FileType.EMAIL]: 0,
    [FileType.IMAGE]: 0,
    [FileType.OTHER]: 0,
    [FileType.PRESENTATION]: 0,
    [FileType.PUBLICATION]: 0,
    [FileType.SPREADSHEET]: 0,
    [FileType.VIDEO]: 0,
    [FileType.WEB]: 0,
  }),
  mapValues(sumBy("size")),
  groupBy("type"),
  map((fileOrFolder: FilesAndFolders) => ({
    size: fileOrFolder.file_size,
    type: getFileType(fileOrFolder),
  })),
  Object.values,
  getFiles
);

const sumFileType: Mapper<FileTypeMap<number>, number> = compose(
  sum,
  Object.values
);

/**
 * Computes the percentage of each file type
 */
export const percentFileTypes: Mapper<
  FilesAndFoldersCollection,
  FileTypeMap<number>
> = compose((counts: FileTypeMap<number>) => {
  const filesCount = sumFileType(counts);
  return _.mapValues(counts, (filesForType: number) =>
    getPercentage(filesForType, filesCount)
  );
}, countFileTypes);

/**
 * Gets the list of extensions for each file
 */
export const getExtensionsList: Accessor<FileTypeMap<string>> = compose(
  defaults({
    [FileType.ARCHIVE]: "",
    [FileType.AUDIO]: "",
    [FileType.DATA]: "",
    [FileType.DOCUMENT]: "",
    [FileType.EMAIL]: "",
    [FileType.IMAGE]: "",
    [FileType.OTHER]: "",
    [FileType.PRESENTATION]: "",
    [FileType.PUBLICATION]: "",
    [FileType.SPREADSHEET]: "",
    [FileType.VIDEO]: "",
    [FileType.WEB]: "",
  }),
  mapValues(join(", ")),
  getExtensionsForEachFileType
);

/**
 * Sorts a FilesAndFoldersCollection by its lastModifiedDate in ascending order
 */
export const sortFilesByLastModifiedDate: Mapper<
  FilesAndFoldersCollection,
  FilesAndFoldersCollection
  // eslint-disable-next-line @typescript-eslint/naming-convention
> = sortBy(({ file_last_modified }) => file_last_modified);

/**
 * Returns the 5 oldest files info by last modified date
 */
export const getOldestFiles: Mapper<
  FilesAndFoldersCollection,
  AuditReportFileWithDate[]
> = compose(
  map<FilesAndFolders, AuditReportFileWithDate>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ({ name, id, file_last_modified }) => ({
      date: formatAuditReportDate(file_last_modified),
      name,
      path: formatPathForUserSystem(id),
    })
  ),
  take(5),
  sortFilesByLastModifiedDate,
  getFiles
);

/**
 * Sorts a FilesAndFoldersCollection by its lastModifiedDate in ascending order
 */
export const sortFilesBySize: Mapper<
  FilesAndFoldersCollection,
  FilesAndFoldersCollection
  // eslint-disable-next-line @typescript-eslint/naming-convention
> = sortBy(({ file_size }) => file_size);

/**
 * Returns the 5 oldest files info by last modified date
 */
export const getBiggestFiles: Mapper<
  FilesAndFoldersCollection,
  AuditReportFileWithSize[]
> = compose(
  map<FilesAndFolders, AuditReportFileWithSize>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ({ name, id, file_size }) => ({
      name,
      path: formatPathForUserSystem(id),
      size: bytes2HumanReadableFormat(file_size),
    })
  ),
  reverse,
  takeRight(5),
  sortFilesBySize,
  getFiles
);

/**
 * Returns the percentage of duplicated folders
 */
export const getDuplicateFoldersPercent: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  number
> = compose(
  curriedToDecimalFloat(2),
  countDuplicatesPercentForFolders as Merger<
    FilesAndFoldersCollection,
    HashesMap,
    number
  >
);

/**
 * Returns the percentage of duplicated files
 */
export const getDuplicateFilesPercent: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  number
> = compose(
  curriedToDecimalFloat(2),
  countDuplicatesPercentForFiles as Merger<
    FilesAndFoldersCollection,
    HashesMap,
    number
  >
);

type CountDuplicateFilesTotalSize = (
  filesAndFoldersCollection: FilesAndFoldersCollection,
  hashesMap: HashesMap
) => number;
type BytesToHumanReadableFormat = (size: number) => string;

/**
 * Calculates the total size of duplicate files in the collection of files and folders.
 *
 * @param {FilesAndFoldersCollection} filesAndFoldersCollection The collection of files and folders.
 * @param {HashesMap} hashesMap The map of file hashes.
 * @returns {number} The total size of duplicate files in bytes.
 */
export function getDuplicateTotalSize(
  filesAndFoldersCollection: FilesAndFoldersCollection,
  hashesMap: HashesMap
): number {
  const countDuplicateFilesTotalSizeFunction: CountDuplicateFilesTotalSize =
    countDuplicateFilesTotalSize as CountDuplicateFilesTotalSize;
  return countDuplicateFilesTotalSizeFunction(
    filesAndFoldersCollection,
    hashesMap
  );
}

/**
 * Converts the total size of duplicate files into a human-readable string.
 *
 * @param {number} totalSize The total size of duplicate files in bytes.
 * @returns {string} The total size of duplicate files in a human-readable format.
 */
export function getHumanReadableDuplicateTotalSize(totalSize: number): string {
  const bytesToHumanReadableFormatFunction: BytesToHumanReadableFormat =
    bytes2HumanReadableFormat as BytesToHumanReadableFormat;
  return bytesToHumanReadableFormatFunction(totalSize);
}

/**
 * Returns the most duplicated files formatted for the audit report
 */
export const getDuplicatesWithTheMostCopy: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  AuditReportFileWithCount[]
> = compose(
  map((filesAndFolders: FilesAndFolders[]) => ({
    count: filesAndFolders.length - 1,
    name: filesAndFolders[0].name,
    path: formatPathForUserSystem(filesAndFolders[0].id),
  })),
  getMostDuplicatedFiles(5) as unknown as Merger<
    FilesAndFoldersCollection,
    HashesMap,
    number
  >
);

/**
 * Returns the duplicated folders that take the most space formatted for the audit report
 */
export const getDuplicatesWithTheBiggestSize = compose(
  map(
    (
      filesAndFolders: FilesAndFolders &
        FilesAndFoldersMetadata & { count: number }
    ) => ({
      name: filesAndFolders.name,
      path: formatPathForUserSystem(filesAndFolders.id),
      size: bytes2HumanReadableFormat(
        (filesAndFolders.count - 1) * filesAndFolders.childrenTotalSize
      ),
    })
  ),
  getBiggestDuplicatedFolders(5)
);

/**
 * Formats an element to be deleted into an audit report element.
 *
 * @param {FilesAndFolders} element The element to delete.
 * @param {FilesAndFoldersMetadata} metadata The metadata of the element.
 * @param {string} folderText The text representation for folders.
 * @param {string} fileText The text representation for files.
 * @returns {AuditReportElementWithType} The audit report element.
 */
function formatElementToDelete(
  element: FilesAndFolders,
  metadata: FilesAndFoldersMetadata,
  folderText: string,
  fileText: string
): AuditReportElementWithType {
  const type = isFile(element) ? fileText : folderText;
  return {
    date: formatAuditReportDate(metadata.maxLastModified),
    name: element.name,
    path: formatPathForUserSystem(element.id),
    size: bytes2HumanReadableFormat(metadata.childrenTotalSize),
    type,
  };
}

/**
 * Retrieves the elements to delete from the provided files and folders data.
 *
 * @param {FilesAndFoldersMap} filesAndFolders The map of files and folders.
 * @param {FilesAndFoldersMetadataMap} filesAndFoldersMetadata The map of files and folders metadata.
 * @param {string[]} elementsToDelete The IDs of elements to delete.
 * @returns {AuditReportElementWithType[]} The elements to delete with their metadata.
 */
export function getElementsToDelete(
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  elementsToDelete: string[]
): AuditReportElementWithType[] {
  const folderText = translations.t("common.folder");
  const fileText = translations.t("common.fileWord");

  return elementsToDelete.map((id) =>
    formatElementToDelete(
      filesAndFolders[id],
      filesAndFoldersMetadata[id],
      folderText,
      fileText
    )
  );
}
