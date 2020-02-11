import fs from "fs";
import _ from "lodash";
import path from "path";
import { FilesAndFoldersMetadataMap } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { isFile } from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFolders,
  FilesAndFoldersMap
} from "../reducers/files-and-folders/files-and-folders-types";
import { medianOnSortedArray } from "../util/array-util";
import { convertToPosixAbsolutePath } from "../util/file-sys-util";
import { empty } from "../util/function-util";
import { indexSort } from "../util/list-util";

interface LoadFilesAndFoldersFromFileSystemError {
  error: string;
  path: string;
}

interface FilesAndFoldersInfo {
  lastModified: number;
  size: number;
}

export type FilesAndFoldersElementInfo = [FilesAndFoldersInfo, string];

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

interface CreateFilesAndFoldersOptions {
  alias?: string;
  children?: string[];
  file_last_modified?: number;
  file_size?: number;
  id: string;
}

/**
 * Utility to create a filesAndFolders
 * @param children
 * @param file_last_modified
 * @param file_size
 * @param id
 */
export const createFilesAndFolders = ({
  children = [],
  file_last_modified = 0,
  file_size = 0,
  id
}: CreateFilesAndFoldersOptions): FilesAndFolders => ({
  children,
  file_last_modified,
  file_size,
  hash: null,
  id,
  name: path.basename(id)
});

/**
 * Computes the filesAndFolders structure for the store
 * @param ffInfo
 * @param hook
 */
export const createFilesAndFoldersDataStructure = (
  ffInfo: FilesAndFoldersElementInfo[],
  hook?: () => void
): FilesAndFoldersMap => {
  const filesAndFolders: FilesAndFoldersMap = {};

  const recursivelyAddParentFolders = elementPath => {
    const parentPath = path.dirname(elementPath);
    if (!filesAndFolders[parentPath]) {
      const normalizedParentPath = parentPath !== "/" ? parentPath : "";
      filesAndFolders[normalizedParentPath] = createFilesAndFolders({
        children: [elementPath],
        id: normalizedParentPath
      });

      if (normalizedParentPath !== "") {
        recursivelyAddParentFolders(parentPath);
      }
      return;
    }

    filesAndFolders[parentPath].children.push(elementPath);
  };

  ffInfo.forEach(([{ lastModified, size }, currentPath]) => {
    filesAndFolders[currentPath] = {
      children: [],
      file_last_modified: lastModified,
      file_size: size,
      hash: null,
      id: currentPath,
      name: path.basename(currentPath)
    };
    recursivelyAddParentFolders(currentPath);
    if (hook) {
      hook();
    }
  });

  return filesAndFolders;
};

/**
 * Compute the metadata from the filesAndFolders
 * @param filesAndFolders
 * @param hook
 */
export const createFilesAndFoldersMetadataDataStructure = (
  filesAndFolders: FilesAndFoldersMap,
  hook = empty
): FilesAndFoldersMetadataMap => {
  const metadata: FilesAndFoldersMetadataMap = {};
  const lastModifiedLists = {};

  const computeMetadataRec = id => {
    const ff = filesAndFolders[id];
    hook();
    if (isFile(ff)) {
      metadata[id] = {
        averageLastModified: ff.file_last_modified,
        childrenTotalSize: ff.file_size,
        maxLastModified: ff.file_last_modified,
        medianLastModified: ff.file_last_modified,
        minLastModified: ff.file_last_modified,
        nbChildrenFiles: 1,
        sortByDateIndex: [],
        sortBySizeIndex: []
      };
      lastModifiedLists[id] = [ff.file_last_modified];
      return;
    }

    ff.children.forEach(childId => computeMetadataRec(childId));

    lastModifiedLists[id] = _(ff.children)
      .map(childId => lastModifiedLists[childId])
      .flatten()
      .sortBy()
      .value();
    const childrenTotalSize = _.sum(
      ff.children.map(childId => metadata[childId].childrenTotalSize)
    );
    const averageLastModified = _.mean(lastModifiedLists[id]);
    const medianLastModified = medianOnSortedArray(lastModifiedLists[id]);
    const maxLastModified =
      lastModifiedLists[id][lastModifiedLists[id].length - 1];
    const minLastModified = lastModifiedLists[id][0];
    const nbChildrenFiles = _.sum(
      ff.children.map(childId => metadata[childId].nbChildrenFiles)
    );
    const sortByDateIndex = indexSort(
      childId => metadata[childId].maxLastModified,
      _(ff.children)
    ).value();

    const sortBySizeIndex = indexSort(
      childId => metadata[childId].childrenTotalSize,
      _(ff.children)
    )
      .reverse()
      .value();

    metadata[id] = {
      averageLastModified,
      childrenTotalSize,
      maxLastModified,
      medianLastModified,
      minLastModified,
      nbChildrenFiles,
      sortByDateIndex,
      sortBySizeIndex
    };
  };

  computeMetadataRec("");

  return metadata;
};
