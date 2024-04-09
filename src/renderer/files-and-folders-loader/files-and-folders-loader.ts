import { type WorkerError } from "@common/types";
import { ArchifiltreDocsErrorType, convertFsErrorToArchifiltreDocsError } from "@common/utils/error";
import { type HashesMap } from "@common/utils/hashes-types";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import jszip from "jszip";
import { noop } from "lodash";
import { compose, defaults } from "lodash/fp";
import path from "path";
import readline from "readline";
import { type Readable } from "stream";

import { reduceFilesAndFolders, ROOT_FF_ID } from "../reducers/files-and-folders/files-and-folders-selectors";
import {
  type FilesAndFolders,
  type FilesAndFoldersMap,
  type VirtualPathToIdMap,
} from "../reducers/files-and-folders/files-and-folders-types";
import { FileSystemLoadingStep } from "../reducers/loading-state/loading-state-types";
import { isFile } from "../utils";
import { convertJsonToCurrentVersion } from "../utils/compatibility";
import { getIdFromPath } from "../utils/file-and-folders";
import { identifyFileFormat } from "../utils/file-format";
import { convertToPosixAbsolutePath } from "../utils/file-system/file-sys-util";
import { shouldIgnoreElement } from "../utils/hidden-file";
import { removeIgnoredElementsFromVirtualFileSystem } from "../utils/virtual-file-system";
import { sanitizeHooks } from "./file-system-loading-process-utils";
import {
  type FilesAndFoldersLoader,
  type FileSystemLoadingHooks,
  type JsonFileInfo,
  type PartialFileSystem,
  type WithErrorHook,
  type WithFilesAndFolders,
  type WithHashes,
  type WithResultHook,
  type WithVirtualPathToIdMap,
} from "./files-and-folders-loader-types";

interface FilesAndFoldersInfo {
  lastModified: number;
  size: number;
}

export type FilesElementInfo = [FilesAndFoldersInfo, string];

export const getFilesElementInfosFromFilesAndFolders = (filesAndFolders: FilesAndFoldersMap): FilesElementInfo[] =>
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
  { rootPaths, fileInfos = [] }: { fileInfos?: FilesElementInfo[]; rootPaths: string[] },
  { onResult, onError }: WithErrorHook & WithResultHook = {
    onError: noop,
    onResult: noop,
  },
) => {
  const files = [...fileInfos];
  const rootPath = path.dirname(folderPath);

  async function loadFoldersFromFileSystemRec(currentPath: string) {
    const children = await fs.promises.readdir(currentPath);

    return Promise.all(
      children.map(async childPath => loadFilesAndFoldersFromFileSystemRec(path.join(currentPath, childPath))),
    );
  }

  async function loadZipFromFileSystemRec(currentPath: string) {
    const zipContent = await fs.promises.readFile(currentPath);
    const zip = await jszip.loadAsync(zipContent);
    for (const fileName in zip.files) {
      const filePath = `${currentPath}/${fileName}`;
      if (await shouldIgnoreElement(filePath)) {
        continue;
      }
      if (fileName.endsWith("/")) {
        continue;
      }
      const fileInformation = zip.files[fileName] as jszip.JSZipObject & {
        _data: { compressedSize: number; uncompressedSize: number };
      };

      onResult();
      files.push([
        {
          lastModified: new Date(fileInformation.date).getTime(),
          size: fileInformation._data.compressedSize,
        },
        getIdFromPath(rootPath, `${currentPath}/${fileName}`),
      ]);
    }
  }

  const loadFilesAndFoldersFromFileSystemRec = async (currentPath: string) => {
    try {
      if (await shouldIgnoreElement(currentPath)) {
        return;
      }
      const stats = await fs.promises.stat(currentPath);

      if (stats.isDirectory()) {
        await loadFoldersFromFileSystemRec(currentPath);
        return;
      } else if (currentPath.endsWith(".zip")) {
        await loadZipFromFileSystemRec(currentPath);
        return;
      }

      onResult();
      files.push([
        {
          lastModified: stats.mtimeMs,
          size: stats.size,
        },
        getIdFromPath(rootPath, currentPath),
      ]);
    } catch (error: unknown) {
      onError({
        code: convertFsErrorToArchifiltreDocsError((error as WorkerError).code),
        filePath: currentPath,
        reason: (error as WorkerError).message,
        type: ArchifiltreDocsErrorType.LOADING_FILE_SYSTEM,
      });
    }
  };

  await Promise.all(rootPaths.map(async elementPath => loadFilesAndFoldersFromFileSystemRec(elementPath)));

  return files;
};

export const retryLoadFromFileSystem =
  ({ filesAndFolders, erroredPaths }: WithFilesAndFolders & { erroredPaths: string[] }) =>
  async (
    folderPath: string,
    { onResult, onError }: WithErrorHook & WithResultHook = {
      onError: noop,
      onResult: noop,
    },
  ): Promise<FilesElementInfo[]> => {
    const fileInfos = getFilesElementInfosFromFilesAndFolders(filesAndFolders);

    return loadFilesAndFoldersFromFileSystemImpl(
      folderPath,
      { fileInfos, rootPaths: erroredPaths },
      { onError, onResult },
    );
  };

export const asyncLoadFilesAndFoldersFromFileSystem = async (
  folderPath: string,
  { onResult, onError }: WithErrorHook & WithResultHook = {
    onError: noop,
    onResult: noop,
  },
): Promise<FilesElementInfo[]> =>
  loadFilesAndFoldersFromFileSystemImpl(folderPath, { rootPaths: [folderPath] }, { onError, onResult });

interface LoadFilesAndFoldersFromExportFileContentResult {
  files: FilesElementInfo[];
  hashes: HashesMap;
  rootPath: string;
}

/**
 * Creates an origin structure from an archifiltre export file
 * @param exportFilePath - The path of an export file generating by archifiltre command line exporter
 * @param hooks
 */
export const loadFilesAndFoldersFromExportFile = async (
  exportFilePath: string,
  hooks?: WithResultHook,
): Promise<LoadFilesAndFoldersFromExportFileContentResult> => {
  const fileFormat = await identifyFileFormat(exportFilePath);
  const fileStream = fs.createReadStream(exportFilePath, fileFormat);

  return loadFilesAndFoldersFromExportFileContent(fileStream, hooks);
};

const latestVersion = "windows-1.0.1";

interface LoadedLine {
  fileHash: string;
  fileLastModified: string;
  filePath: string;
  fileSize: string;
}
type LineLoader = (parsedLine: string[]) => LoadedLine;

const LINE_LOADERS: Record<string, LineLoader> = {
  [latestVersion]: ([[filePath, fileSize, fileLastModified, fileHash]]) => ({
    fileHash,
    fileLastModified,
    filePath,
    fileSize,
  }),
  "unix-1.0.0": ([[filePath, fileLastModified, fileSize, fileHash]]) => ({
    fileHash,
    fileLastModified,
    filePath,
    fileSize,
  }),
  "windows-1.0.0": ([[filePath, fileSize, fileLastModified, ...rest]]) => ({
    // Whe take the last element as the rest, as the last modified date may be an integer or a float (randomly)
    fileHash: rest[rest.length - 1],

    fileLastModified,

    filePath,

    fileSize,
  }),
};

const getLineLoader = (version: string): LineLoader => LINE_LOADERS[version] ?? LINE_LOADERS[latestVersion];

/**
 * Creates an origin structure from an archifiltre export file content
 * @param exportFileContent - The content of an export file generating by archifiltre command line exporter
 * @param hook - A hook called after each file is processed.
 */
export async function loadFilesAndFoldersFromExportFileContent(
  exportFileContent: Readable,
  { onResult }: WithResultHook = { onResult: noop },
): Promise<LoadFilesAndFoldersFromExportFileContentResult> {
  const lineReader = readline.createInterface({
    crlfDelay: Infinity,
    input: exportFileContent,
  });

  let lineCount = 0;
  let basePath = "";
  let rootPath = "";
  let pathImpl: typeof path.posix | typeof path.win32 = path;
  const hashes: HashesMap = {};
  const files: FilesElementInfo[] = [];
  let version = latestVersion;
  let os = "windows";
  for await (const line of lineReader) {
    /* eslint-disable no-case-declarations */
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
        const { filePath, fileSize, fileLastModified, fileHash } = loader(parse(line.trim()) as string[]);
        const id = convertToPosixAbsolutePath(pathImpl.relative(rootPath, filePath), { separator: pathImpl.sep });
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

      /* eslint-enable no-case-declarations */
    }

    lineCount++;
  }

  return {
    files,
    hashes,
    rootPath: basePath,
  };
}

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
  virtualPath: virtualPath ?? id,
});

/**
 * Computes the filesAndFolders structure for the store
 */
export const createFilesAndFoldersDataStructure = (
  ffInfo: FilesElementInfo[],
  { onResult }: WithResultHook = { onResult: noop },
): FilesAndFoldersMap => {
  const filesAndFolders: FilesAndFoldersMap = {};

  const recursivelyAddParentFolders = (elementPath: string) => {
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

type LoadFunction = (folderPath: string, hooks: FileSystemLoadingHooks) => Promise<FilesElementInfo[]>;

/**
 * Create the loader to load from archifiltre data from the file system folder
 */
export const makeFileSystemLoader =
  (_loadFunction: LoadFunction): ((folderPath: string) => FilesAndFoldersLoader) =>
  (folderPath: string): FilesAndFoldersLoader =>
  async makeHooks => {
    const sanitizedHooks = sanitizeHooks(makeHooks);

    const indexingHooks = sanitizedHooks(FileSystemLoadingStep.INDEXING);

    indexingHooks.onStart();
    const fileSystemInfo = await asyncLoadFilesAndFoldersFromFileSystem(folderPath, indexingHooks);
    indexingHooks.onComplete();

    const filesAndFoldersHooks = sanitizedHooks(FileSystemLoadingStep.FILES_AND_FOLDERS);
    filesAndFoldersHooks.onStart();
    const filesAndFolders = createFilesAndFoldersDataStructure(fileSystemInfo, filesAndFoldersHooks);
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
 */
const removeByteOrderMark = (content: string) => (!content.startsWith("{") ? content.slice(1) : content);

/**
 * Initialize the reference map between virtualPath and id
 */
const computeVirtualPathToIdMap = <T extends WithFilesAndFolders>(fileSystem: T): T & WithVirtualPathToIdMap => {
  const virtualPathToIdMap: VirtualPathToIdMap = {};

  reduceFilesAndFolders(fileSystem.filesAndFolders, ROOT_FF_ID, (_, { id, virtualPath }) => {
    if (virtualPath !== id) {
      virtualPathToIdMap[virtualPath] = id;
    }
  });

  return {
    ...fileSystem,
    virtualPathToIdMap,
  };
};

/**
 * Create the loader to load archifiltre data from a JSON file
 */
export const makeJsonFileLoader =
  (jsonFilePath: string): FilesAndFoldersLoader =>
  (): JsonFileInfo => {
    const jsonContent = fs.readFileSync(jsonFilePath, "utf8");
    const sanitizedContent = removeByteOrderMark(jsonContent);

    return compose(
      defaults({
        overrideLastModified: {},
      }),
      computeVirtualPathToIdMap,
      removeIgnoredElementsFromVirtualFileSystem,
      convertJsonToCurrentVersion,
    )(sanitizedContent) as JsonFileInfo;
  };

/**
 * Create the loader for command line generated export files
 */
export const makeExportFileLoader =
  (exportFilePath: string): FilesAndFoldersLoader =>
  async (hooksCreator): Promise<PartialFileSystem & WithHashes> => {
    const hooks = sanitizeHooks(hooksCreator)(FileSystemLoadingStep.INDEXING);
    hooks.onStart();
    const exportFileData = await loadFilesAndFoldersFromExportFile(exportFilePath, hooks);
    hooks.onComplete();

    return {
      filesAndFolders: createFilesAndFoldersDataStructure(exportFileData.files),
      hashes: exportFileData.hashes,
      originalPath: exportFileData.rootPath,
    };
  };
