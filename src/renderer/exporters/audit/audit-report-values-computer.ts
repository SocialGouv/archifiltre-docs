import {
  countDuplicateFilesTotalSize,
  countDuplicatesPercentForFiles,
  countDuplicatesPercentForFolders,
  getBiggestDuplicatedFolders,
  getMostDuplicatedFiles,
} from "@common/utils/duplicates/duplicates-util";
import {
  formatPathForUserSystem,
  octet2HumanReadableFormat,
} from "@common/utils/file-system/file-sys-util";
import {
  FileType,
  getExtensionsForEachFileType,
  getFileType,
} from "@common/utils/file-types/file-types-util";
import type {
  Accessor,
  Mapper,
  Merger,
} from "@common/utils/functionnal-programming-utils";
import {
  curriedFormatPercent,
  percent,
} from "@common/utils/numbers/numbers-util";
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
import type { HashesMap } from "../../reducers/hashes/hashes-types";
import { translations } from "../../translations/translations";
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
    [FileType.PUBLICATION]: 0,
    [FileType.PRESENTATION]: 0,
    [FileType.SPREADSHEET]: 0,
    [FileType.EMAIL]: 0,
    [FileType.DOCUMENT]: 0,
    [FileType.IMAGE]: 0,
    [FileType.VIDEO]: 0,
    [FileType.AUDIO]: 0,
    [FileType.OTHER]: 0,
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
    [FileType.PUBLICATION]: 0,
    [FileType.PRESENTATION]: 0,
    [FileType.SPREADSHEET]: 0,
    [FileType.EMAIL]: 0,
    [FileType.DOCUMENT]: 0,
    [FileType.IMAGE]: 0,
    [FileType.VIDEO]: 0,
    [FileType.AUDIO]: 0,
    [FileType.OTHER]: 0,
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
  const nbFiles = sumFileType(counts);
  return _.mapValues(counts, (filesForType: number) =>
    percent(filesForType, nbFiles, { numbersOfDecimals: 2 })
  );
}, countFileTypes);

/**
 * Gets the list of extensions for each file
 */
export const getExtensionsList: Accessor<FileTypeMap<string>> = compose(
  defaults({
    [FileType.PUBLICATION]: "",
    [FileType.PRESENTATION]: "",
    [FileType.SPREADSHEET]: "",
    [FileType.EMAIL]: "",
    [FileType.DOCUMENT]: "",
    [FileType.IMAGE]: "",
    [FileType.VIDEO]: "",
    [FileType.AUDIO]: "",
    [FileType.OTHER]: "",
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
      size: octet2HumanReadableFormat(file_size),
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
  curriedFormatPercent({ numbersOfDecimals: 2 }),
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
  curriedFormatPercent({ numbersOfDecimals: 2 }),
  countDuplicatesPercentForFiles as Merger<
    FilesAndFoldersCollection,
    HashesMap,
    number
  >
);

/**
 * Returns the total size of duplicated files
 */
export const getHumanReadableDuplicateTotalSize: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  string
> = compose(
  octet2HumanReadableFormat,
  countDuplicateFilesTotalSize as Merger<
    FilesAndFoldersCollection,
    HashesMap,
    number
  >
);

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
      size: octet2HumanReadableFormat(
        (filesAndFolders.count - 1) * filesAndFolders.childrenTotalSize
      ),
    })
  ),
  getBiggestDuplicatedFolders(5)
);

export const getElementsToDelete = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  elementsToDelete: string[]
): AuditReportElementWithType[] => {
  const folderText = translations.t("common.folder");
  const fileText = translations.t("common.file");
  return elementsToDelete
    .map((filesAndFoldersId) => filesAndFolders[filesAndFoldersId])
    .map(
      (fileAndFolder): AuditReportElementWithType => ({
        date: formatAuditReportDate(
          filesAndFoldersMetadata[fileAndFolder.id].maxLastModified
        ),
        name: fileAndFolder.name,
        path: formatPathForUserSystem(fileAndFolder.id),
        size: octet2HumanReadableFormat(
          filesAndFoldersMetadata[fileAndFolder.id].childrenTotalSize
        ),
        type: isFile(fileAndFolder) ? fileText : folderText,
      })
    );
};
