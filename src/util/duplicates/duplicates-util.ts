import {
  compose,
  constant,
  defaults,
  divide,
  filter,
  groupBy,
  identity,
  keyBy,
  mapValues,
  omit,
  omitBy,
  over,
  overArgs,
  pickBy,
  reverse,
  size as lodashSize,
  sortBy,
  spread,
  sum,
  takeRight,
  toArray,
  values,
} from "lodash/fp";

import _ from "lodash";

import {
  FilesAndFoldersMetadata,
  FilesAndFoldersMetadataMap,
} from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  FilesAndFoldersCollection,
  getFiles,
  getFilesMap,
  getFolders,
  getFoldersMap,
} from "reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { Mapper, Merger } from "util/functionnal-programming-utils";
import { FileTypeMap } from "exporters/audit/audit-report-values-computer";
import { FileType, getFileType } from "../file-types/file-types-util";
import { HashesMap } from "reducers/hashes/hashes-types";

export interface DuplicatesMap {
  [hash: string]: FilesAndFolders[];
}

/**
 * Utility function to transform function args into an array of args
 */
const argsToArray = (
  filesAndFoldersMap: FilesAndFoldersMap,
  hashesMap: HashesMap
) => [filesAndFoldersMap, hashesMap];

/**
 * Filters out imcomplete files and folders from merge
 */
const removeIncompleteFilesAndFolders: Mapper<
  FilesAndFoldersMap,
  FilesAndFoldersMap
> = omitBy<FilesAndFolders & { hash: string }>(
  (filesAndFolders) =>
    filesAndFolders.name === undefined && filesAndFolders.hash === ""
);

/**
 * Merges hashes into filesAndFolders object
 */
const mergeFilesAndFoldersAndHashes: Merger<
  FilesAndFoldersMap,
  HashesMap,
  FilesAndFoldersMap
> = compose(
  removeIncompleteFilesAndFolders,
  (
    filesAndFolders: FilesAndFoldersMap,
    hashes: HashesMap
  ): FilesAndFoldersMap =>
    _.mapValues(filesAndFolders, (fileAndFolder, key) => ({
      ...fileAndFolder,
      hash: hashes[key],
    }))
);

/**
 * Transforms a filesAndFoldersCollection into a map
 */
const getFilesAndFoldersMap: Mapper<
  FilesAndFoldersCollection,
  FilesAndFoldersMap
> = keyBy<FilesAndFolders>("id");

/**
 * Filters the input filesAndFolders using the provided filter function and merges hashes into them
 * @param filesAndFoldersFilter
 */
const filterFilesAndFoldersAndMerge = (
  filesAndFoldersFilter: Mapper<FilesAndFoldersCollection, FilesAndFoldersMap>
) =>
  compose(
    spread(mergeFilesAndFoldersAndHashes),
    overArgs(argsToArray, [
      compose(getFilesAndFoldersMap, filesAndFoldersFilter),
      identity,
    ])
  );

/**
 * Filters the files and folders and generates the duplicates map
 * @param filesAndFoldersFilter
 */
export const getFilteredDuplicatesMap = (
  filesAndFoldersFilter: Mapper<FilesAndFoldersCollection, FilesAndFoldersMap>
): Merger<FilesAndFoldersCollection, HashesMap, DuplicatesMap> =>
  compose(
    omit<
      {
        [hash: string]: FilesAndFolders & { hash: string };
      },
      string
    >(""),
    groupBy(
      ({ hash }: FilesAndFolders & { hash: string | null }): string =>
        hash || ""
    ),
    filterFilesAndFoldersAndMerge(filesAndFoldersFilter)
  );

/**
 * Returns the nbDuplicatedItems most duplicated items
 * @param nbDuplicatedItems
 */
const getMostDuplicatedItems = (
  nbDuplicatedItems: number
): Mapper<FilesAndFoldersMap, FilesAndFolders[][]> =>
  compose(
    toArray,
    reverse,
    takeRight(nbDuplicatedItems),
    filter<FilesAndFolders[]>(
      (filesAndFolders: FilesAndFolders[]) => filesAndFolders.length > 1
    ),
    sortBy<FilesAndFolders[]>("length"),
    Object.values
  );

/**
 * Returns the most duplicated items
 * @param nbDuplicatedItems
 */
export const getMostDuplicatedFiles = (
  nbDuplicatedItems: number
): Merger<FilesAndFoldersMap, HashesMap, FilesAndFolders[][]> =>
  compose(
    getMostDuplicatedItems(nbDuplicatedItems),
    getFilteredDuplicatesMap(getFilesMap)
  );

const getFoldersDuplicatesMap = getFilteredDuplicatesMap(getFoldersMap);

export const getFilesDuplicatesMap = getFilteredDuplicatesMap(getFilesMap);

/**
 * Sums the number of duplicates in a duplicates map based on the count method for element values
 * @param countMethod
 */
const countDuplicatesInDuplicatesMap = (
  countMethod: (file: FilesAndFolders) => number
): Mapper<DuplicatesMap, number> =>
  compose(
    sum,
    values,
    mapValues((filesAndFoldersList: FilesAndFolders[]) =>
      filesAndFoldersList
        .slice(1)
        .reduce(
          (count, fileAndfolder: FilesAndFolders) =>
            count + countMethod(fileAndfolder),
          0
        )
    )
  );

/**
 * Returns the total size of duplicate elements
 */
export const countDuplicateFilesTotalSize: Merger<
  FilesAndFoldersMap,
  HashesMap,
  number
> = compose(
  countDuplicatesInDuplicatesMap(({ file_size }) => file_size),
  getFilesDuplicatesMap
);

/**
 * Get the duplicated files where the duplicates take the most space
 * @param nbDuplicatedItems
 */
export const getBiggestDuplicatedFolders = (nbDuplicatedItems: number) => (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersMetadataMap: FilesAndFoldersMetadataMap,
  hashesMap: HashesMap
): (FilesAndFolders & FilesAndFoldersMetadata & { count: number })[] => {
  const duplicatesMap = getFoldersDuplicatesMap(filesAndFoldersMap, hashesMap);

  return _(duplicatesMap)
    .sortBy(
      (filesAndFoldersList) =>
        (filesAndFoldersList.length - 1) *
        filesAndFoldersMetadataMap[filesAndFoldersList[0].id].childrenTotalSize
    )
    .takeRight(nbDuplicatedItems)
    .filter((filesAndFoldersList) => filesAndFoldersList.length > 1)
    .reverse()
    .map((duplicatedItemsList) => ({
      ...duplicatedItemsList[0],
      ...filesAndFoldersMetadataMap[duplicatedItemsList[0].id],
      count: duplicatedItemsList.length,
    }))
    .value();
};

/**
 * Returns true if a file and folder element has at least one duplicate, false otherwise
 * @param hashes - map of hashes of the file tree
 * @param fileOrFolder - file or folder to check
 */
export const hasDuplicate = (
  hashes: HashesMap = {},
  fileOrFolder: FilesAndFolders
) =>
  _(hashes)
    .omit(fileOrFolder.id)
    .values()
    .filter((hash) => hash !== null)
    .some((hash) => hash === hashes[fileOrFolder.id]);

type Size = {
  size: number;
};

const sumSizes = (sizes: Size[]) =>
  sizes.reduce((sizesSum, { size }) => sizesSum + size, 0);

const getFileSize = (filesAndFolders: FilesAndFolders): number =>
  filesAndFolders.file_size;

const createCountDuplicateFiles = (
  mapFilesAndFoldersToNumber: Mapper<FilesAndFolders, number>
): Mapper<DuplicatesMap, FileTypeMap<number>> =>
  compose(
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
    mapValues(sumSizes),
    groupBy("type"),
    mapValues((filesAndFoldersArray: FilesAndFolders[]) =>
      filesAndFoldersArray.slice(1).reduce(
        (accumulator, element) => ({
          type: getFileType(element),
          size: accumulator.size + mapFilesAndFoldersToNumber(element),
        }),
        { type: FileType.OTHER, size: 0 }
      )
    ),
    pickBy(
      (filesAndFoldersArray: FilesAndFolders[]) =>
        filesAndFoldersArray.length > 1
    )
  );

/**
 * Gets the size of of every duplicate file
 * @param filesAndFolders
 */
export const countDuplicateFileSizes: Mapper<
  DuplicatesMap,
  FileTypeMap<number>
> = createCountDuplicateFiles(getFileSize);

/**
 * Gets the type of of every duplicate file
 * @param filesAndFolders
 */
export const countDuplicateFileTypes: Mapper<
  DuplicatesMap,
  FileTypeMap<number>
> = createCountDuplicateFiles(constant(1));

/**
 * Counts the number of duplicated files
 */
export const countDuplicateFiles: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  number
> = compose(countDuplicatesInDuplicatesMap(constant(1)), getFilesDuplicatesMap);

/**
 * Returns the percentage of duplicated files
 */
export const countDuplicatesPercentForFiles: Merger<
  FilesAndFoldersMap,
  HashesMap,
  number
> = compose(
  spread(divide),
  over([
    compose(countDuplicatesInDuplicatesMap(constant(1)), getFilesDuplicatesMap),
    compose(lodashSize, getFiles),
  ])
);

/**
 * Counts the number of duplicated folders
 */
export const countDuplicateFolders: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  number
> = compose(
  countDuplicatesInDuplicatesMap(constant(1)),
  getFoldersDuplicatesMap
);

/**
 * Returns the percentage of duplicated folders
 */
export const countDuplicatesPercentForFolders: Merger<
  FilesAndFoldersMap,
  HashesMap,
  number
> = compose(
  spread(divide),
  over([
    compose(
      countDuplicatesInDuplicatesMap(constant(1)),
      getFoldersDuplicatesMap
    ),
    compose(lodashSize, getFolders),
  ])
);
