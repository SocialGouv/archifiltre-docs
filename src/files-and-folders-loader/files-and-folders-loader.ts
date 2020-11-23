import fs from "fs";
import { compose, defaults } from "lodash/fp";
import parse from "csv-parse/lib/sync";
import path from "path";
import readline from "readline";
import { Readable } from "stream";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { convertToPosixAbsolutePath } from "util/file-system/file-sys-util";
import { empty } from "util/function/function-util";
import { convertFsErrorToArchifiltreError } from "util/error/error-util";
import { identifyFileFormat } from "util/file-format/file-format-util";
import { asyncShouldIgnoreElement } from "util/hidden-file/hidden-file-util";
import { HashesMap } from "reducers/hashes/hashes-types";
import {
  FilesAndFoldersLoader,
  FileSystemLoadingHooks,
  JsonFileInfo,
  PartialFileSystem,
  WithErrorHook,
  WithFilesAndFolders,
  WithHashes,
  WithResultHook,
  WithVirtualPathToIdMap,
} from "files-and-folders-loader/files-and-folders-loader-types";
import { convertJsonToCurrentVersion } from "util/compatibility/compatibility";
import { FileSystemLoadingStep } from "reducers/loading-state/loading-state-types";
import { removeIgnoredElementsFromVirtualFileSystem } from "util/virtual-file-system-util/virtual-file-system-util";
import {
  isFile,
  reduceFilesAndFolders,
  ROOT_FF_ID,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { sanitizeHooks } from "files-and-folders-loader/file-system-loading-process-utils";
import { ArchifiltreErrorType } from "reducers/loading-info/loading-info-types";

interface FilesAndFoldersInfo {
  lastModified: number;
  size: number;
}

export type FilesElementInfo = [FilesAndFoldersInfo, string];

export const getFilesElementInfosFromFilesAndFolders = (
  filesAndFolders: FilesAndFoldersMap
): FilesElementInfo[] =>
  Object.values(filesAndFolders)
    .filter(isFile)
    .map(({ id, file_last_modified, file_size }) => [
      {
        lastModified: file_last_modified,
        size: file_size,
      },
      id,
    ]);

const loadFilesAndFoldersFromFileSystemImpl = async (
  folderPath: string,
  {
    rootPaths,
    fileInfos = [],
  }: { fileInfos?: FilesElementInfo[]; rootPaths: string[] },
  { onResult, onError }: WithResultHook & WithErrorHook = {
    onResult: empty,
    onError: empty,
  }
) => {
  const files = [...fileInfos];
  const rootPath = path.dirname(folderPath);

  const loadFilesAndFoldersFromFileSystemRec = async (currentPath: string) => {
    try {
      if (await asyncShouldIgnoreElement(currentPath)) {
        return;
      }
      const stats = await fs.promises.stat(currentPath);

      if (stats.isDirectory()) {
        const children = await fs.promises.readdir(currentPath);
        await Promise.all(
          children.map((childPath) =>
            loadFilesAndFoldersFromFileSystemRec(
              path.join(currentPath, childPath)
            )
          )
        );
        return;
      }

      onResult();
      files.push([
        {
          lastModified: stats.mtimeMs,
          size: stats.size,
        },
        convertToPosixAbsolutePath(path.relative(rootPath, currentPath)),
      ]);
    } catch (error) {
      onError({
        type: ArchifiltreErrorType.LOADING_FILE_SYSTEM,
        filePath: currentPath,
        reason: error.message,
        code: convertFsErrorToArchifiltreError(error.code),
      });
    }
  };

  await Promise.all(
    rootPaths.map((elementPath) =>
      loadFilesAndFoldersFromFileSystemRec(elementPath)
    )
  );

  return files;
};

export const retryLoadFromFileSystem = ({
  filesAndFolders,
  erroredPaths,
}: WithFilesAndFolders & { erroredPaths: string[] }) => async (
  folderPath: string,
  { onResult, onError }: WithResultHook & WithErrorHook = {
    onResult: empty,
    onError: empty,
  }
) => {
  const fileInfos = getFilesElementInfosFromFilesAndFolders(filesAndFolders);

  return loadFilesAndFoldersFromFileSystemImpl(
    folderPath,
    { rootPaths: erroredPaths, fileInfos },
    { onResult, onError }
  );
};

export const asyncLoadFilesAndFoldersFromFileSystem = async (
  folderPath: string,
  { onResult, onError }: WithResultHook & WithErrorHook = {
    onResult: empty,
    onError: empty,
  }
) =>
  loadFilesAndFoldersFromFileSystemImpl(
    folderPath,
    { rootPaths: [folderPath] },
    { onResult, onError }
  );

type LoadFilesAndFoldersFromExportFileContentResult = {
  hashes: HashesMap;
  files: FilesElementInfo[];
  rootPath: string;
};

/**
 * Creates an origin structure from an archifiltre export file
 * @param exportFilePath - The path of an export file generating by archifiltre command line exporter
 * @param hooks
 */
export const loadFilesAndFoldersFromExportFile = async (
  exportFilePath: string,
  hooks?: WithResultHook
): Promise<LoadFilesAndFoldersFromExportFileContentResult> => {
  const fileFormat = await identifyFileFormat(exportFilePath);
  const fileStream = fs.createReadStream(exportFilePath, fileFormat);

  return loadFilesAndFoldersFromExportFileContent(fileStream, hooks);
};

const latestVersion = "windows-1.0.1";

type LoadedLine = {
  filePath: string;
  fileSize: string;
  fileLastModified: string;
  fileHash: string;
};
type LineLoader = (parsedLine: string[]) => LoadedLine;

const LINE_LOADERS = {
  "windows-1.0.0": ([[filePath, fileSize, fileLastModified, ...rest]]) => ({
    filePath,
    fileSize,
    fileLastModified,
    // Whe take the last element as the rest, as the last modified date may be an integer or a float (randomly)
    fileHash: rest[rest.length - 1],
  }),
  [latestVersion]: ([[filePath, fileSize, fileLastModified, fileHash]]) => ({
    filePath,
    fileSize,
    fileLastModified,
    fileHash,
  }),
};

const getLineLoader = (version: string): LineLoader =>
  LINE_LOADERS[version] || LINE_LOADERS[latestVersion];

/**
 * Creates an origin structure from an archifiltre export file content
 * @param exportFileContent - The content of an export file generating by archifiltre command line exporter
 * @param hook - A hook called after each file is processed.
 */
export const loadFilesAndFoldersFromExportFileContent = async (
  exportFileContent: Readable,
  { onResult }: WithResultHook = { onResult: empty }
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
  const files: FilesElementInfo[] = [];
  let version = latestVersion;
  let os = "windows";
  for await (const line of lineReader) {
    switch (lineCount) {
      case 0:
        version = line.trim();
        break;
      case 1:
        os = line.trim();
        pathImpl = os === "windows" ? path.win32 : path.posix;
        break;
      case 2:
        basePath = line.trim();
        rootPath = pathImpl.dirname(basePath);
        break;
      default:
        const loader = getLineLoader(`${os}-${version}`);
        const { filePath, fileSize, fileLastModified, fileHash } = loader(
          parse(line.trim())
        );
        const id = convertToPosixAbsolutePath(
          pathImpl.relative(rootPath, filePath),
          { separator: pathImpl.sep }
        );
        hashes[id] = fileHash.toLowerCase();
        const lastModifiedWithoutComma = fileLastModified.replace(",", ".");
        files.push([
          {
            lastModified: +lastModifiedWithoutComma * 1000,
            size: +fileSize,
          },
          id,
        ]);
        onResult();
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
  ffInfo: FilesElementInfo[],
  { onResult }: WithResultHook = { onResult: empty }
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
    onResult();
  });

  return filesAndFolders;
};

type LoadFunction = (
  folderPath: string,
  hooks: FileSystemLoadingHooks
) => Promise<FilesElementInfo[]>;

/**
 * Create the loader to load from archifiltre data from the file system folder
 * @param folderPath
 */
export const makeFileSystemLoader = (loadFunction: LoadFunction) => (
  folderPath: string
): FilesAndFoldersLoader => async (makeHooks) => {
  const sanitizedHooks = sanitizeHooks(makeHooks);

  const indexingHooks = sanitizedHooks(FileSystemLoadingStep.INDEXING);

  indexingHooks.onStart();
  const fileSystemInfo = await asyncLoadFilesAndFoldersFromFileSystem(
    folderPath,
    indexingHooks
  );
  indexingHooks.onComplete();

  const filesAndFoldersHooks = sanitizedHooks(
    FileSystemLoadingStep.FILES_AND_FOLDERS
  );
  filesAndFoldersHooks.onStart();
  const filesAndFolders = createFilesAndFoldersDataStructure(
    fileSystemInfo,
    filesAndFoldersHooks
  );
  filesAndFoldersHooks.onComplete();

  return {
    filesAndFolders,
    originalPath: folderPath,
  };
};

/**
 * Remove the byte order mark
 * Until v10, json files were generated with a
 * byte order mark at their start
 * We upgrade file-saver from 1.3.3 to 2.0.2,
 * they are not anymore generated with a byte order mark
 * @param content
 */
const removeByteOrderMark = (content) =>
  content[0] !== "{" ? content.slice(1) : content;

/**
 * Initialize the reference map between virtualPath and id
 * @param fileSystem
 */
const computeVirtualPathToIdMap = <T extends WithFilesAndFolders>(
  fileSystem: T
): T & WithVirtualPathToIdMap => {
  const virtualPathToIdMap = {};

  reduceFilesAndFolders(
    fileSystem.filesAndFolders,
    ROOT_FF_ID,
    (childrenValues, { id, virtualPath }) => {
      if (virtualPath !== id) {
        virtualPathToIdMap[virtualPath] = id;
      }
    }
  );

  return {
    ...fileSystem,
    virtualPathToIdMap,
  };
};

/**
 * Create the loader to load archifiltre data from a JSON file
 * @param jsonFilePath
 */
export const makeJsonFileLoader = (
  jsonFilePath: string
): FilesAndFoldersLoader => (): JsonFileInfo => {
  const jsonContent = fs.readFileSync(jsonFilePath, "utf8");
  const sanitizedContent = removeByteOrderMark(jsonContent);

  return compose(
    defaults({
      overrideLastModified: {},
    }),
    computeVirtualPathToIdMap,
    removeIgnoredElementsFromVirtualFileSystem,
    convertJsonToCurrentVersion
  )(sanitizedContent);
};

/**
 * Create the loader for command line generated export files
 * @param exportFilePath
 */
export const makeExportFileLoader = (
  exportFilePath: string
): FilesAndFoldersLoader => async (
  hooksCreator
): Promise<PartialFileSystem & WithHashes> => {
  const hooks = sanitizeHooks(hooksCreator)(FileSystemLoadingStep.INDEXING);
  hooks.onStart();
  const exportFileData = await loadFilesAndFoldersFromExportFile(
    exportFilePath,
    hooks
  );
  hooks.onComplete();

  return {
    filesAndFolders: createFilesAndFoldersDataStructure(exportFileData.files),
    hashes: exportFileData.hashes,
    originalPath: exportFileData.rootPath,
  };
};
