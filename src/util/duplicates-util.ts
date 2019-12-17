import memoize from "fast-memoize";
import {
  add,
  compose,
  divide,
  filter,
  groupBy,
  identity,
  invertBy,
  keyBy,
  map,
  omitBy,
  over,
  overArgs,
  pick,
  reduce,
  reverse,
  size,
  sortBy,
  spread,
  sum,
  takeRight,
  toArray
} from "lodash/fp";

import _ from "lodash";

import {
  FilesAndFoldersMetadata,
  FilesAndFoldersMetadataMap
} from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  FilesAndFoldersCollection,
  getFiles,
  getFilesMap,
  getFolders,
  getFoldersMap
} from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
  HashesMap
} from "../reducers/files-and-folders/files-and-folders-types";
import { Mapper, Merger } from "./functionnal-programming-utils";

export interface DuplicatesMap {
  [hash: string]: FilesAndFolders[];
}

export interface DuplicatesIdMap {
  [hash: string]: string[];
}

/**
 * Utility function to transform function args into an array of args
 */
const argsToArray = memoize(
  (filesAndFoldersMap: FilesAndFoldersMap, hashesMap: HashesMap) => [
    filesAndFoldersMap,
    hashesMap
  ]
);

/**
 * Groups filesAndFolders (with hash) by hash
 */
const groupFilesAndFoldersByHash: Mapper<
  FilesAndFoldersMap,
  DuplicatesMap
> = memoize(groupBy<FilesAndFolders>("hash"));

/**
 * Groups filesAndFolders ids by hash
 */
const groupFileIdsByHashes: Mapper<HashesMap, DuplicatesIdMap> = memoize(
  invertBy(identity)
);

/**
 * Filters out imcomplete files and folders from merge
 */
const removeIncompleteFilesAndFolders: Mapper<
  FilesAndFoldersMap,
  FilesAndFoldersMap
> = omitBy<FilesAndFolders>(
  filesAndFolders =>
    filesAndFolders.name === undefined && filesAndFolders.hash === ""
);

/**
 * Merges hashes into filesAndFolders object
 */
const mergeFilesAndFoldersAndHashes: Merger<
  FilesAndFoldersMap,
  HashesMap,
  FilesAndFoldersMap
> = memoize(
  compose(
    removeIncompleteFilesAndFolders,
    (
      filesAndFolders: FilesAndFoldersMap,
      hashes: HashesMap
    ): FilesAndFoldersMap =>
      _.mapValues(filesAndFolders, (fileAndFolder, key) => ({
        ...fileAndFolder,
        hash: hashes[key]
      }))
  )
);

/**
 * Transforms a filesAndFoldersCollection into a map
 */
const getFilesAndFoldersMap: Mapper<
  FilesAndFoldersCollection,
  FilesAndFoldersMap
> = memoize(keyBy<FilesAndFolders>("id"));

/**
 * Filters the input filesAndFolders using the provided filter function and merges hashes into them
 * @param filesAndFoldersFilter
 */
const filterFilesAndFoldersAndMerge = (
  filesAndFoldersFilter: Mapper<FilesAndFoldersCollection, FilesAndFoldersMap>
) =>
  memoize(
    compose(
      spread(mergeFilesAndFoldersAndHashes),
      overArgs(argsToArray, [
        compose(getFilesAndFoldersMap, filesAndFoldersFilter),
        identity
      ])
    )
  );

/**
 * Filters the files and folders and generates the duplicates map
 * @param filesAndFoldersFilter
 */
const getFilteredDuplicatesMap = (
  filesAndFoldersFilter: Mapper<FilesAndFoldersCollection, FilesAndFoldersMap>
): Merger<FilesAndFoldersCollection, HashesMap, DuplicatesMap> =>
  memoize(
    compose(
      groupBy(({ hash }: FilesAndFolders): string => hash || ""),
      filterFilesAndFoldersAndMerge(filesAndFoldersFilter)
    )
  );

/**
 * Counts the number of duplicates in a FilesAndFoldersMap
 * @param filesAndFoldersMap
 */
export const countDuplicates: Mapper<HashesMap, number> = memoize(
  compose(
    reduce(add)(0),
    map<DuplicatesIdMap, number>((fileIds: string[]) => fileIds.length - 1),
    groupFileIdsByHashes
  )
);

/**
 * Returns the hashesMap with only hashes corresponding to files
 */
const getHashesForFile = memoize(
  compose(
    spread(pick),
    overArgs(argsToArray, [compose(map("id"), getFiles), identity])
  )
);

/**
 * Returns the hashesMap with only hashes corresponding to folders
 */
const getHashesForFolders = memoize(
  compose(
    spread(pick),
    overArgs(argsToArray, [compose(map("id"), getFolders), identity])
  )
);

/**
 * Counts the number of duplicated files
 */
export const countDuplicateFiles: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  number
> = memoize(compose(countDuplicates, getHashesForFile));

/**
 * Counts the number of duplicated folders
 */
export const countDuplicateFolders: Merger<
  FilesAndFoldersCollection,
  HashesMap,
  number
> = memoize(compose(countDuplicates, getHashesForFolders));

/**
 * Counts the percentage of duplicates in a FilesAndFoldersMap
 * @param filesAndFoldersMap
 */
export const countDuplicatesPercent: Mapper<
  FilesAndFoldersMap,
  number
> = memoize(compose(spread(divide), over([countDuplicates, size])));

/**
 * Returns the percentage of duplicated files
 */
export const countDuplicatesPercentForFiles: Merger<
  FilesAndFoldersMap,
  HashesMap,
  number
> = memoize(compose(countDuplicatesPercent, getHashesForFile));

/**
 * Returns the percentage of duplicated folders
 */
export const countDuplicatesPercentForFolders: Merger<
  FilesAndFoldersMap,
  HashesMap,
  number
> = memoize(compose(countDuplicatesPercent, getHashesForFolders));

/**
 * Counts the total size of duplicated elements
 */
export const countDuplicatesTotalSize: Mapper<
  FilesAndFoldersMap,
  number
> = memoize(
  compose(
    sum,
    map(
      (filesAndFolders: FilesAndFolders[]) =>
        filesAndFolders[0].file_size * (filesAndFolders.length - 1)
    ),
    groupFilesAndFoldersByHash
  )
);

/**
 * Returns the total size of duplicate elements
 */
export const countDuplicateFilesTotalSize: Merger<
  FilesAndFoldersMap,
  HashesMap,
  number
> = memoize(
  compose(countDuplicatesTotalSize, filterFilesAndFoldersAndMerge(getFilesMap))
);

/**
 * Returns the nbDuplicatedItems most duplicated items
 * @param nbDuplicatedItems
 */
const getMostDuplicatedItems = (
  nbDuplicatedItems: number
): Mapper<FilesAndFoldersMap, FilesAndFolders[][]> =>
  memoize(
    compose(
      toArray,
      reverse,
      takeRight(nbDuplicatedItems),
      filter<FilesAndFolders[]>(
        (filesAndFolders: FilesAndFolders[]) => filesAndFolders.length > 1
      ),
      sortBy<FilesAndFolders[]>("length"),
      Object.values
    )
  );

/**
 * Returns the most duplicated items
 * @param nbDuplicatedItems
 */
export const getMostDuplicatedFiles = (
  nbDuplicatedItems: number
): Merger<FilesAndFoldersMap, HashesMap, FilesAndFolders[][]> =>
  memoize(
    compose(
      getMostDuplicatedItems(nbDuplicatedItems),
      getFilteredDuplicatesMap(getFilesMap)
    )
  );

const getFoldersDuplicatesMap = getFilteredDuplicatesMap(getFoldersMap);

/**
 * Get the duplicated files where the duplicates take the most space
 * @param nbDuplicatedItems
 */
export const getBiggestDuplicatedFolders = (nbDuplicatedItems: number) => (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersMetadataMap: FilesAndFoldersMetadataMap,
  hashesMap: HashesMap
): Array<FilesAndFolders & FilesAndFoldersMetadata & { count: number }> => {
  const duplicatesMap = getFoldersDuplicatesMap(filesAndFoldersMap, hashesMap);

  return _(duplicatesMap)
    .sortBy(
      filesAndFoldersList =>
        (filesAndFoldersList.length - 1) *
        filesAndFoldersMetadataMap[filesAndFoldersList[0].id].childrenTotalSize
    )
    .takeRight(nbDuplicatedItems)
    .filter(filesAndFoldersList => filesAndFoldersList.length > 1)
    .reverse()
    .map(duplicatedItemsList => ({
      ...duplicatedItemsList[0],
      ...filesAndFoldersMetadataMap[duplicatedItemsList[0].id],
      count: duplicatedItemsList.length
    }))
    .value();
};
