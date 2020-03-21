import { FilesAndFolders } from "./files-and-folders-types";

/**
 * Utility function to create a prefilled filesAndFolders.
 * @param id
 * @param hash
 * @param file_last_modified
 * @param children
 * @param file_size
 * @param name
 */
export const createFilesAndFolders = ({
  id,
  hash = "",
  file_last_modified = 0,
  children = [] as string[],
  file_size = 0,
  name = "base-name",
}): FilesAndFolders => ({
  children,
  file_last_modified,
  file_size,
  hash,
  id,
  name,
});
