import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFilesAndFoldersFromStore,
  getHashesFromStore
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import { makeNameWithExt, save } from "../../util/file-sys-util";

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
  version
}: JsonExporterThunkArgs): ArchifiltreThunkAction => (dispatch, getState) => {
  addTracker({
    title: ActionTitle.JSON_EXPORT,
    type: ActionType.TRACK_EVENT
  });
  const state = getState();
  const fileName = makeNameWithExt(sessionName, "json");

  const exportedData = {
    filesAndFolders: getFilesAndFoldersFromStore(state),
    filesAndFoldersMetadata: getFilesAndFoldersMetadataFromStore(state),
    hashes: getHashesFromStore(state),
    originalPath,
    sessionName,
    tags: getTagsFromStore(state),
    version
  };

  save(fileName, JSON.stringify(exportedData));
};
