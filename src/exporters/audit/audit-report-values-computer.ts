import dateFormat from "dateformat";
import memoize from "fast-memoize";
import _ from "lodash";
import {
  compose,
  countBy,
  defaults,
  head,
  identity,
  join,
  map,
  mapValues,
  reverse,
  sortBy,
  sum,
  take,
  takeRight
} from "lodash/fp";
import { octet2HumanReadableFormat } from "../../components/ruler";
import {
  FilesAndFoldersCollection,
  getFiles
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import {
  FileType,
  getExtensionsForEachFileType,
  getFileType
} from "../../util/file-types-util";
import {
  Accessor,
  Mapper,
  tap
} from "../../util/functionnal-programming-utils";
import { percent } from "../../util/numbers-util";
import {
  AuditReportFileWithDate,
  AuditReportFileWithSize
} from "./audit-report-generator";

type FileTypeMap<T> = {
  [key in FileType]: T;
};
/**
 * Formats the date to the expect audit report format
 * @param timestamp
 */
export const formatAuditReportDate = (timestamp: number): string =>
  dateFormat(timestamp, "dd/mm/yyyy");

/**
 * Sorts a FilesAndFoldersMap or FilesAndFolders[] by path length in a descending order.
 * Function is memoized for better composition
 * @param filesAndFolders
 */
const sortFilesAndFoldersByPathLength: Mapper<
  FilesAndFoldersCollection,
  FilesAndFolders[]
> = memoize(sortBy((fileOrFolder: FilesAndFolders) => -fileOrFolder.id.length));

/**
 * Gets the file with the longest path
 * Function is memoized for better composition
 * @param filesAndFolders
 */
export const getLongestPathFile: Mapper<
  FilesAndFoldersCollection,
  FilesAndFolders | undefined
> = memoize(compose(head, sortFilesAndFoldersByPathLength));

/**
 * Gets the number of files of every types
 * @param filesAndFolders
 */
export const countFileTypes: Mapper<
  FilesAndFoldersCollection,
  FileTypeMap<number>
> = memoize(
  compose(
    defaults({
      [FileType.PRESENTATION]: 0,
      [FileType.SPREADSHEET]: 0,
      [FileType.EMAIL]: 0,
      [FileType.DOCUMENT]: 0,
      [FileType.MEDIA]: 0,
      [FileType.OTHER]: 0
    }),
    countBy(identity),
    map(getFileType),
    Object.values,
    getFiles
  )
);

export const sumFileType: Mapper<FileTypeMap<number>, number> = memoize(
  compose(sum, Object.values)
);

/**
 * Computes the percentage of each file type
 * @param filesAndFolders
 */
export const percentFileTypes: Mapper<
  FilesAndFoldersCollection,
  FileTypeMap<number>
> = memoize(
  compose((counts: FileTypeMap<number>) => {
    const nbFiles = sumFileType(counts);
    return _.mapValues(counts, (filesForType: number) =>
      percent(filesForType, nbFiles, { numbersOfDecimals: 2 })
    );
  }, countFileTypes)
);

/**
 * Gets the list of extensions for each file
 */
export const getExtensionsList: Accessor<FileTypeMap<string>> = memoize(
  compose(
    defaults({
      [FileType.PRESENTATION]: "",
      [FileType.SPREADSHEET]: "",
      [FileType.EMAIL]: "",
      [FileType.DOCUMENT]: "",
      [FileType.MEDIA]: "",
      [FileType.OTHER]: ""
    }),
    mapValues(join(", ")),
    getExtensionsForEachFileType
  )
);

/**
 * Sorts a FilesAndFoldersCollection by its lastModifiedDate in ascending order
 * @param filesAndFolders
 */
export const sortFilesByLastModifiedDate: Mapper<
  FilesAndFoldersCollection,
  FilesAndFoldersCollection
> = memoize(sortBy(({ file_last_modified }) => file_last_modified));

/**
 * Returns the 5 oldest files info by last modified date
 * @param filesAndFolders
 */
export const getOldestFiles: Mapper<
  FilesAndFoldersCollection,
  AuditReportFileWithDate[]
> = memoize(
  compose(
    map(
      ({ name, id, file_last_modified }): AuditReportFileWithDate => ({
        date: formatAuditReportDate(file_last_modified),
        name,
        path: id
      })
    ),
    take(5),
    sortFilesByLastModifiedDate,
    getFiles
  )
);

/**
 * Sorts a FilesAndFoldersCollection by its lastModifiedDate in ascending order
 * @param filesAndFolders
 */
export const sortFilesBySize: Mapper<
  FilesAndFoldersCollection,
  FilesAndFoldersCollection
> = memoize(sortBy(({ file_size }) => file_size));

/**
 * Returns the 5 oldest files info by last modified date
 * @param filesAndFolders
 */
export const getBiggestFiles: Mapper<
  FilesAndFoldersCollection,
  AuditReportFileWithSize[]
> = memoize(
  compose(
    map(
      ({ name, id, file_size }): AuditReportFileWithSize => ({
        name,
        path: id,
        size: octet2HumanReadableFormat(file_size)
      })
    ),
    reverse,
    takeRight(5),
    sortFilesBySize,
    getFiles
  )
);
