import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getElementsToDeleteFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import { getWorkspaceMetadataFromStore } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import { makeSIP } from "./mets";

/**
 * Thunk to export to METS
 * @param exportPath
 */
export const metsExporterThunk = (
  exportPath: string
): ArchifiltreThunkAction => (dispatch, getState): void => {
  const state = getState();
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);
  const tags = getTagsFromStore(state);
  const aliases = getAliasesFromStore(state);
  const comments = getCommentsFromStore(state);
  const elementsToDelete = getElementsToDeleteFromStore(state);
  const { sessionName, originalPath } = getWorkspaceMetadataFromStore(state);

  makeSIP({
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    exportPath,
    originalPath,
    sessionName,
    tags,
  });
};
