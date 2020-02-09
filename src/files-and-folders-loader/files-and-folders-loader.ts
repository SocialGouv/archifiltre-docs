import fs from "fs";
import path from "path";
import { convertToPosixAbsolutePath } from "../util/file-sys-util";

interface LoadFilesAndFoldersFromFileSystemError {
  error: string;
  path: string;
}

interface FilesAndFoldersInfo {
  lastModified: number;
  size: number;
}

type FilesAndFoldersElementInfo = [FilesAndFoldersInfo, string];

/**
 * Recursively load all the children files from the file system
 * @param folderPath - The folder base path
 * @param hook - An error first hook with no argument, called every time a file is added.
 */
export const loadFilesAndFoldersFromFileSystem = (
  folderPath: string,
  hook: (error?: LoadFilesAndFoldersFromFileSystemError) => void
): FilesAndFoldersElementInfo[] => {
  const files: FilesAndFoldersElementInfo[] = [];
  const rootPath = path.dirname(folderPath);

  const loadFilesAndFoldersFromFileSystemRec = (currentPath: string) => {
    try {
      const stats = fs.statSync(currentPath);
      if (stats.isDirectory()) {
        const children = fs.readdirSync(currentPath);
        children.forEach(childPath =>
          loadFilesAndFoldersFromFileSystemRec(
            path.join(currentPath, childPath)
          )
        );
        return;
      }

      hook();
      files.push([
        {
          lastModified: stats.mtimeMs,
          size: stats.size
        },
        convertToPosixAbsolutePath(path.relative(rootPath, currentPath))
      ]);
    } catch (error) {
      hook({ path: currentPath, error: error.message });
    }
  };

  loadFilesAndFoldersFromFileSystemRec(folderPath);

  return files;
};
