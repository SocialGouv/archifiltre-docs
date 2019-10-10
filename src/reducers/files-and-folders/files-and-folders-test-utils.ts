import { FilesAndFolders } from "./files-and-folders-types";

/**
 * Utility function to create a prefilled filesAndFolders.
 * @param id
 * @param alias
 * @param hash
 * @param comments
 * @param file_last_modified
 * @param children
 * @param file_size
 */
export const createFilesAndFolders = ({
  id,
  alias = "",
  hash = "",
  comments = "",
  file_last_modified = 0,
  children = [] as string[],
  file_size = 0
}): FilesAndFolders => ({
  alias,
  children,
  comments,
  file_last_modified,
  file_size,
  hash,
  id,
  name: "base-name"
});
