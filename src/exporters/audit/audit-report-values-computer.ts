import memoize from "fast-memoize";
import { compose, head, sortBy } from "lodash/fp";
import { FilesAndFoldersCollection } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { Mapper } from "../../util/functionnal-programming-utils";

/**
 * Sorts a FilesAndFoldersMap or FilesAndFolders[] by path length in a descending order.
 * Function is memoized for better composition
 * @param filesAndFolders
 */
const sortFilesAndFoldersByPathLength = memoize(
  sortBy((fileOrFolder: FilesAndFolders) => -fileOrFolder.id.length)
);

/**
 * Gets the file with the longest path
 * Function is memoized for better composition
 * @param filesAndFolders
 */
export const getLongestPathFile: Mapper<
  FilesAndFoldersCollection,
  FilesAndFolders
> = memoize(compose([head, sortFilesAndFoldersByPathLength]));
