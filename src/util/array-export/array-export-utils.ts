import {
  getAliasesFromStore,
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import type {
  AliasMap,
  CommentsMap,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getHashesFromStore } from "../../reducers/hashes/hashes-selectors";
import type { HashesMap } from "../../reducers/hashes/hashes-types";
import type { StoreState } from "../../reducers/store";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import type { TagMap } from "../../reducers/tags/tags-types";

interface CsvExportParams {
  aliases: AliasMap;
  comments: CommentsMap;
  elementsToDelete: string[];
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes: HashesMap;
  tags: TagMap;
}
export const getCsvExportParamsFromStore = (
  state: StoreState
): CsvExportParams => ({
  aliases: getAliasesFromStore(state),
  comments: getCommentsFromStore(state),
  elementsToDelete: getElementsToDeleteFromStore(state),
  filesAndFolders: getFilesAndFoldersFromStore(state),
  filesAndFoldersMetadata: getFilesAndFoldersMetadataFromStore(state),
  hashes: getHashesFromStore(state),
  tags: getTagsFromStore(state),
});
