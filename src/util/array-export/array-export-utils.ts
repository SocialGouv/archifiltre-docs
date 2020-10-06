import { StoreState } from "reducers/store";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";
import { getTagsFromStore } from "reducers/tags/tags-selectors";

export const getCsvExportParamsFromStore = (state: StoreState) => ({
  aliases: getAliasesFromStore(state),
  comments: getCommentsFromStore(state),
  elementsToDelete: getElementsToDeleteFromStore(state),
  filesAndFolders: getFilesAndFoldersFromStore(state),
  filesAndFoldersMetadata: getFilesAndFoldersMetadataFromStore(state),
  hashes: getHashesFromStore(state),
  tags: getTagsFromStore(state),
});
