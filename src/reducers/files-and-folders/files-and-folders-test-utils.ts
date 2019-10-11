import { FilesAndFolders } from "./files-and-folders-types";

/**
 * Utility function to create a prefilled filesAndFolders.
 * @param id
 * @param alias
 * @param hash
 */
export const createFilesAndFolders = ({
  id,
  alias = "",
  hash = "",
  comments = ""
}): FilesAndFolders => ({
  alias,
  children: [],
  comments,
  file_last_modified: 1570625049127,
  file_size: 10,
  hash,
  id,
  name: "base-name"
});
