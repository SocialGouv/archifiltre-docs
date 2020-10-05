import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { getDepthFromPath } from "reducers/files-and-folders/files-and-folders-selectors";
import { makeObjectKeyComparator } from "util/sort-utils/sort-utils";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
): Observable<string[]> =>
  from(
    Object.values(filesAndFoldersMap)
      .filter(({ id }) => id !== "")
      .sort(makeObjectKeyComparator<FilesAndFolders>("virtualPath"))
  ).pipe(
    map((filesAndFolders) => {
      const { virtualPath, name } = filesAndFolders;
      const depth = getDepthFromPath(virtualPath);
      const shiftArray = depth <= 0 ? [] : new Array(depth).fill("");
      return [...shiftArray, name];
    })
  );
