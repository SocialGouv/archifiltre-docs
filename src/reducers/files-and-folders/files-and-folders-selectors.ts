import _ from "lodash";
import { medianOnSortedArray } from "../../util/array-util";
import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import { StoreState } from "../store";
import { FilesAndFolders, FilesAndFoldersMap } from "./files-and-folders-types";

/**
 * Gets the files and folder map from the redux state
 * @param store - The current redux state
 */
export const getFilesAndFoldersFromStore = (
  store: StoreState
): FilesAndFoldersMap => getCurrentState(store.filesAndFolders).filesAndFolders;

/**
 * Reduces a filesAndFolders tree to a single value
 * @param filesAndFoldersMap - A files and folders map
 * @param rootId - The files and folders rootId
 * @param reducer - The reducer function. Takes the children values and the file or folder and returns a reduced value.
 * @example
 *  const getFilesAndFoldersMaxLastModified = (
 *    filesAndFoldersMap: FilesAndFoldersMap,
 *    filesAndFoldersId: string
 *  ): number =>
 *    reduceFilesAndFolders(
 *      filesAndFoldersMap,
 *      filesAndFoldersId,
 *      (childrenValues, currentFilesAndFolders) =>
 *        _.max([currentFilesAndFolders.file_last_modified, ...childrenValues])
 *    );
 */
const reduceFilesAndFolders = <ReduceResultType>(
  filesAndFoldersMap: FilesAndFoldersMap,
  rootId: string,
  reducer: (
    childrenValues: ReduceResultType[],
    currentFilesAndFolders: FilesAndFolders
  ) => ReduceResultType
) => {
  const currentFilesAndFolders = filesAndFoldersMap[rootId];
  const childrenValues = currentFilesAndFolders.children.map(childId =>
    reduceFilesAndFolders(filesAndFoldersMap, childId, reducer)
  );

  return reducer(childrenValues, currentFilesAndFolders);
};

/**
 * Returns the maximum value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersMaxLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) =>
      _.max([currentFilesAndFolders.file_last_modified, ...childrenValues])
  );

/**
 * Returns the minimum value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersMinLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) =>
      _.min(
        [currentFilesAndFolders.file_last_modified, ...childrenValues].filter(
          lastModifiedDate => lastModifiedDate !== 0
        )
      )
  );

/**
 * Returns all the last_modified_date values for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
const getAllLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number[] =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) => {
      if (currentFilesAndFolders.file_last_modified === 0) {
        return _.flatten(childrenValues);
      } else {
        return [
          ..._.flatten(childrenValues),
          currentFilesAndFolders.file_last_modified
        ];
      }
    }
  );

/**
 * Returns the average value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersAverageLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number => _.mean(getAllLastModified(filesAndFoldersMap, filesAndFoldersId));

/**
 * Returns the median value of file_last_modified for this element and his subElements
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersMedianLastModified = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  medianOnSortedArray(
    getAllLastModified(filesAndFoldersMap, filesAndFoldersId).sort(
      (value1, value2) => value1 - value2
    )
  );

/**
 * Get the total size of the selected filesAndFolders
 * @param filesAndFoldersMap
 * @param filesAndFoldersId
 */
export const getFilesAndFoldersTotalSize = (
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): number =>
  reduceFilesAndFolders(
    filesAndFoldersMap,
    filesAndFoldersId,
    (childrenValues, currentFilesAndFolders) =>
      _.sum([...childrenValues, currentFilesAndFolders.file_size])
  );
