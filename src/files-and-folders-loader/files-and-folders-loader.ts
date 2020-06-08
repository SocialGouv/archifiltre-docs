import fs from "fs";
import _ from "lodash";
import parse from "csv-parse/lib/sync";
import path from "path";
import readline from "readline";
import { Readable } from "stream";
import { once } from "events";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
  HashesMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { medianOnSortedArray } from "util/array/array-util";
import { convertToPosixAbsolutePath } from "util/file-system/file-sys-util";
import { empty } from "util/function/function-util";
import { indexSort, indexSortReverse } from "util/list-util";
import {
  ArchifiltreErrorCode,
  convertFsErrorToArchifiltreError,
} from "util/error/error-util";
import { identifyFileFormat } from "../util/file-format/file-format-util";

interface LoadFilesAndFoldersFromFileSystemError {
  message: string;
  code: ArchifiltreErrorCode;
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
        children.forEach((childPath) =>
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
          size: stats.size,
        },
        convertToPosixAbsolutePath(path.relative(rootPath, currentPath)),
      ]);
    } catch (error) {
      hook({
        path: currentPath,
        message: error.message,
        code: convertFsErrorToArchifiltreError(error.code),
      });
    }
  };

  loadFilesAndFoldersFromFileSystemRec(folderPath);

  return files;
};

type LoadFilesAndFoldersFromExportFileContentResult = {
  hashes: HashesMap;
  files: FilesAndFoldersElementInfo[];
  rootPath: string;
};

/**
 * Creates an origin structure from an archifiltre export file
 * @param exportFilePath - The path of an export file generating by archifiltre command line exporter
 * @param hook - A hook called after each file is processed.
 */
export const loadFilesAndFoldersFromExportFile = async (
  exportFilePath: string,
  hook: () => void = empty
): Promise<LoadFilesAndFoldersFromExportFileContentResult> => {
  const fileFormat = await identifyFileFormat(exportFilePath);
  const fileStream = fs.createReadStream(exportFilePath, fileFormat);

  return loadFilesAndFoldersFromExportFileContent(fileStream, hook);
};

/**
 * Creates an origin structure from an archifiltre export file content
 * @param exportFileContent - The content of an export file generating by archifiltre command line exporter
 * @param hook - A hook called after each file is processed.
 */
export const loadFilesAndFoldersFromExportFileContent = async (
  exportFileContent: Readable,
  hook: () => void = empty
): Promise<LoadFilesAndFoldersFromExportFileContentResult> => {
  const lineReader = readline.createInterface({
    input: exportFileContent,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  let basePath = "";
  let rootPath = "";
  let pathImpl: typeof path.win32 | typeof path.posix = path;
  const hashes: HashesMap = {};
  const files: FilesAndFoldersElementInfo[] = [];
  for await (const line of lineReader) {
    switch (lineCount) {
      case 0:
        break;
      case 1:
        const os = line.trim();
        pathImpl = os === "windows" ? path.win32 : path.posix;
        break;
      case 2:
        basePath = line.trim();
        rootPath = pathImpl.dirname(basePath);
        break;
      default:
        const [[filePath, fileSize, fileLastModified, fileHash]] = parse(
          line.trim()
        );
        const id = convertToPosixAbsolutePath(
          pathImpl.relative(rootPath, filePath),
          { separator: pathImpl.sep }
        );
        hashes[id] = fileHash;
        files.push([
          {
            lastModified: +fileLastModified,
            size: +fileSize,
          },
          id,
        ]);
        hook();
    }

    lineCount++;
  }

  return {
    files,
    hashes,
    rootPath: basePath,
  };
};

interface CreateFilesAndFoldersOptions {
  alias?: string;
  children?: string[];
  file_last_modified?: number;
  file_size?: number;
  id: string;
  virtualPath?: string;
}

/**
 * Utility to create a filesAndFolders
 * @param children
 * @param file_last_modified
 * @param file_size
 * @param id
 * @param virtualPath
 */
export const createFilesAndFolders = ({
  children = [],
  file_last_modified = 0,
  file_size = 0,
  id,
  virtualPath,
}: CreateFilesAndFoldersOptions): FilesAndFolders => ({
  children,
  file_last_modified,
  file_size,
  id,
  name: path.basename(id),
  virtualPath: virtualPath || id,
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

  const recursivelyAddParentFolders = (elementPath) => {
    const parentPath = path.dirname(elementPath);
    if (!filesAndFolders[parentPath]) {
      const normalizedParentPath = parentPath !== "/" ? parentPath : "";
      filesAndFolders[normalizedParentPath] = createFilesAndFolders({
        children: [elementPath],
        id: normalizedParentPath,
      });

      if (normalizedParentPath !== "") {
        recursivelyAddParentFolders(parentPath);
      }
      return;
    }

    filesAndFolders[parentPath].children.push(elementPath);
  };

  ffInfo.forEach(([{ lastModified, size }, currentPath]) => {
    filesAndFolders[currentPath] = createFilesAndFolders({
      children: [],
      file_last_modified: lastModified,
      file_size: size,
      id: currentPath,
    });
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

  const computeMetadataRec = (id) => {
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
        sortBySizeIndex: [],
      };
      lastModifiedLists[id] = [ff.file_last_modified];
      return;
    }

    ff.children.forEach((childId) => computeMetadataRec(childId));

    lastModifiedLists[id] = _(ff.children)
      .map((childId) => lastModifiedLists[childId])
      .flatten()
      .sortBy()
      .value();
    const childrenTotalSize = _.sum(
      ff.children.map((childId) => metadata[childId].childrenTotalSize)
    );
    const averageLastModified = _.mean(lastModifiedLists[id]);
    const medianLastModified = medianOnSortedArray(lastModifiedLists[id]);
    const maxLastModified =
      lastModifiedLists[id][lastModifiedLists[id].length - 1];
    const minLastModified = lastModifiedLists[id][0];
    const nbChildrenFiles = _.sum(
      ff.children.map((childId) => metadata[childId].nbChildrenFiles)
    );
    const sortByDateIndex = indexSort(
      (childId: string) => metadata[childId].averageLastModified,
      ff.children
    );

    const sortBySizeIndex = indexSortReverse(
      (childId: string) => metadata[childId].childrenTotalSize,
      ff.children
    );

    metadata[id] = {
      averageLastModified,
      childrenTotalSize,
      maxLastModified,
      medianLastModified,
      minLastModified,
      nbChildrenFiles,
      sortByDateIndex,
      sortBySizeIndex,
    };
  };

  computeMetadataRec("");

  return metadata;
};
