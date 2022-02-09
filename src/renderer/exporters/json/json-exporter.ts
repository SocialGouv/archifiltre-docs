import {
  getNameWithExtension,
  save,
} from "@common/utils/file-system/file-sys-util";

import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
  getLastModifiedDateOverrides,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getHashesFromStore } from "../../reducers/hashes/hashes-selectors";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";

export type ExportToJson = typeof jsonExporterThunk;

export interface JsonExporterThunkArgs {
  sessionName: string;
  originalPath: string;
  version: string;
}

/**
 * Exports the store data to a json file, and prompts the user to save it.
 * @param sessionName - The sessionName from real estate
 * @param originalPath - The originalPath from real estate
 * @param version - The version from real estate
 */
export const jsonExporterThunk =
  ({
    sessionName,
    originalPath,
    version,
  }: JsonExporterThunkArgs): ArchifiltreDocsThunkAction =>
  (dispatch, getState) => {
    addTracker({
      title: ActionTitle.JSON_EXPORT,
      type: ActionType.TRACK_EVENT,
    });
    const state = getState();
    const fileName = getNameWithExtension(sessionName, "json");

    const exportedData = {
      aliases: getAliasesFromStore(state),
      comments: getCommentsFromStore(state),
      elementsToDelete: getElementsToDeleteFromStore(state),
      filesAndFolders: getFilesAndFoldersFromStore(state),
      hashes: getHashesFromStore(state),
      originalPath,
      overrideLastModified: getLastModifiedDateOverrides(state),
      sessionName,
      tags: getTagsFromStore(state),
      version,
    };

    save(fileName, JSON.stringify(exportedData));
  };
