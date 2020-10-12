import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { getDepthFromPath } from "reducers/files-and-folders/files-and-folders-selectors";
import { makeObjectKeyComparator } from "util/sort-utils/sort-utils";
import { interval, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { chunk } from "lodash";

const computeTreeSection = (filesAndFolders: FilesAndFolders[]): string[][] =>
  filesAndFolders.map((filesAndFolders) => {
    const { virtualPath, name } = filesAndFolders;
    const depth = getDepthFromPath(virtualPath);
    const shiftArray = depth <= 0 ? [] : new Array(depth).fill("");
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
