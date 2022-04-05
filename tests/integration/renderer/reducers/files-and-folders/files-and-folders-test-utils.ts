import type { FilesAndFolders } from "@renderer/reducers/files-and-folders/files-and-folders-types";

interface CreateFilesAndFoldersOptions {
  children?: string[];
  file_last_modified?: number;
  file_size?: number;
  id: string;
  name?: string;
  virtualPath?: string;
}

/**
 * Utility function to create a prefilled filesAndFolders.
 */
export const createFilesAndFolders = ({
  id,
  file_last_modified = 0,
  children = [],
  file_size = 0,
  name = "base-name",
  virtualPath,
}: CreateFilesAndFoldersOptions): FilesAndFolders => ({
  children,
  file_last_modified,
  file_size,
  id,
  name,
  virtualPath: virtualPath ?? id,
});
