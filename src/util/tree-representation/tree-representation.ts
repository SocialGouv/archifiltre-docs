import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { getDepthFromPath } from "reducers/files-and-folders/files-and-folders-selectors";
import { makeObjectKeyComparator } from "util/sort-utils/sort-utils";

/**
 * Computes a tree array of a FilesAndFoldersMap
 * @param filesAndFoldersMap
 *  * @example
 * // Graphical representation of file tree
 * // root
 * // | - folder
 * //   | - file
 * computeTreeStructure(filesAndFoldersMap)
 * // [["root"],
 * // ["", "folder"],
 * // ["", "", "file"]]
 */
export const computeTreeStructureArray = (
  filesAndFoldersMap: FilesAndFoldersMap
) =>
  Object.values(filesAndFoldersMap)
    .filter(({ id }) => id !== "")
    .sort(makeObjectKeyComparator<FilesAndFolders>("virtualPath"))
    .map((filesAndFolders) => {
      const { virtualPath, name } = filesAndFolders;
      const depth = getDepthFromPath(virtualPath);
      const shiftArray = depth <= 0 ? [] : new Array(depth).fill("");
      return [...shiftArray, name];
    });
