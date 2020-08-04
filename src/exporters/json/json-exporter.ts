import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getElementsToDeleteFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import { getNameWithExtension, save } from "util/file-system/file-sys-util";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";

interface JsonExporterThunkArgs {
  sessionName: string;
  originalPath: string;
  version: number;
}

/**
 * Exports the store data to a json file, and prompts the user to save it.
 * @param sessionName - The sessionName from real estate
 * @param originalPath - The originalPath from real estate
 * @param version - The version from real estate
 */
export const jsonExporterThunk = ({
  sessionName,
  originalPath,
  version,
}: JsonExporterThunkArgs): ArchifiltreThunkAction => (dispatch, getState) => {
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
    filesAndFoldersMetadata: getFilesAndFoldersMetadataFromStore(state),
    hashes: getHashesFromStore(state),
    originalPath,
    sessionName,
    tags: getTagsFromStore(state),
    version,
  };

  save(fileName, JSON.stringify(exportedData));
};
