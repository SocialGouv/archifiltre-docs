import version from "version";

import * as ObjectUtil from "util/object-util";
import * as RecordUtil from "util/record-util";
import * as FilesAndFolders from "datastore/files-and-folders";
import * as Tags from "datastore/tags";

import pick from "languages";

if (isNaN(version) || typeof version !== "number") {
  throw new Error("version is not a number");
}

const virtualFileSystem = RecordUtil.createFactory(
  {
    session_name: pick({
      en: "Project name",
      fr: "Nom du projet"
    }),
    original_path: "",
    version,
    files_and_folders: FilesAndFolders.empty(),
    tags: Tags.empty()
  },
  {
    toJs: a =>
      ObjectUtil.compose(
        {
          files_and_folders: FilesAndFolders.toJs(a.files_and_folders),
          tags: Tags.toJs(a.tags)
        },
        a
      ),
    fromJs: a =>
      ObjectUtil.compose(
        {
          files_and_folders: FilesAndFolders.fromJs(a.files_and_folders),
          tags: Tags.fromJs(a.tags)
        },
        a
      )
  }
);

/**
 * Create the virtual file system
 * @param {Array} origin - The list of the extracted files
 * @param {string} path - The base folder path
 * @param {function} [hook] - A hook called after each file treatment
 * @returns {*}
 */
export const make = (origin, path, hook) =>
  virtualFileSystem({
    files_and_folders: FilesAndFolders.ff(origin, hook),
    original_path: path
  });

/**
 * Compute derivated data about tags
 * @param vfs - A VirtualFileSystem instance
 * @returns {*}
 */
export const derivateTags = vfs =>
  vfs.update("tags", tags => Tags.update(vfs.get("files_and_folders"), tags));

/**
 * Compute derivated data about filesAndFolder
 * @param vfs - A VirtualFileSystem instance
 * @param hook - A hook called after each treated file to track progress
 * @returns {*} - A VirtualFileSystem instance with enriched filesAndFolders data.
 */
export const derivateFilesAndFolders = (vfs, hook) =>
  vfs.update("files_and_folders", ff =>
    FilesAndFolders.computeDerived(ff, hook)
  );

/**
 * Compute derivated data from the Virtual File System
 * @param vfs - A VirtualFileSystem instance
 * @param hook - A hook called after each treated file to track progress
 * @returns {*} - A VirtualFileSystem instance with enriched data.
 */
export const derivate = (vfs, hook) =>
  derivateTags(derivateFilesAndFolders(vfs, hook));

export const toJs = virtualFileSystem.toJs;
export const fromJs = virtualFileSystem.fromJs;
