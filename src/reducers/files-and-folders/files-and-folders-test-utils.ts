import { FilesAndFolders } from "./files-and-folders-types";

interface CreateFilesAndFoldersOptions {
  id: string;
  file_last_modified?: number;
  children?: string[];
  file_size?: number;
  name?: string;
  virtualPath?: string;
}

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
  file_last_modified = 0,
  children = [],
  file_size = 0,
  name = "base-name",
  virtualPath
}: CreateFilesAndFoldersOptions): FilesAndFolders => ({
  children,
  file_last_modified,
  file_size,
  id,
  name,
  virtualPath: virtualPath || id
});
