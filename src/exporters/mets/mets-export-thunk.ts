import { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getFilesAndFoldersFromStore } from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import { makeSIP } from "./mets";

interface MetsExportThunkOptions {
  originalPath: string;
  sessionName: string;
}

/**
 * Thunk to export to METS
 * @param state - The application state as ImmutableJS Record
 */
export const metsExporterThunk = ({
  originalPath,
  sessionName
}: MetsExportThunkOptions): ArchifiltreThunkAction => (
  dispatch,
  getState
): void => {
  const state = getState();
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);
  const tags = getTagsFromStore(state);

  makeSIP({
    filesAndFolders,
    filesAndFoldersMetadata,
    originalPath,
    sessionName,
    tags
  });
};
