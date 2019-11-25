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
  sortBy,
  sum
} from "lodash/fp";
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
import { Accessor, Mapper } from "../../util/functionnal-programming-utils";
import { percent } from "../../util/numbers-util";

type FileTypeMap<T> = {
  [key in FileType]: T;
};

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
