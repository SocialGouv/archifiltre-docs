import { chunk } from "lodash";
import type { Observable } from "rxjs";
import { interval } from "rxjs";
import { map, take } from "rxjs/operators";

import { getDepthFromPath } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import { makeObjectKeyComparator } from "../sort-utils/sort-utils";

const computeTreeSection = (filesAndFolders: FilesAndFolders[]): string[][] =>
  filesAndFolders.map((ff) => {
    const { virtualPath, name } = ff;
    const depth = getDepthFromPath(virtualPath);
    const shiftArray = depth <= 0 ? [] : new Array<string>(depth).fill("");
    return [...shiftArray, name];
  });

const CHUNK_SIZE = 1000;

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
): Observable<string[][]> => {
  const filesAndFolders = Object.values(filesAndFoldersMap)
    .filter(({ id }) => id !== "")
    .sort(makeObjectKeyComparator<FilesAndFolders>("virtualPath"));

  const chunks = chunk(filesAndFolders, CHUNK_SIZE);

  return interval().pipe(
    take(chunks.length),
    map((index) => chunks[index]),
    map(computeTreeSection)
  );
};
