import { type CsvExportData } from "../../exporters/csv/csv-exporter-types";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getHashesFromStore } from "../../reducers/hashes/hashes-selectors";
import { getMetadataByEntity, getMetadataKeys } from "../../reducers/metadata/metadata-operations";
import { getMetadataContextFromState } from "../../reducers/metadata/metadata-selector";
import { getMetadataMapping } from "../../reducers/seda-configuration/seda-configuration-selector";
import { type StoreState } from "../../reducers/store";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";

export const getCsvExportParamsFromStore = (state: StoreState): CsvExportData => {
  const metadataContext = getMetadataContextFromState(state);

  return {
    aliases: getAliasesFromStore(state),
    comments: getCommentsFromStore(state),
    elementsToDelete: getElementsToDeleteFromStore(state),
    filesAndFolders: getFilesAndFoldersFromStore(state),
    filesAndFoldersMetadata: getFilesAndFoldersMetadataFromStore(state),
    hashes: getHashesFromStore(state),
    metadata: getMetadataByEntity(metadataContext),
    metadataKeys: getMetadataKeys(metadataContext),
    sedaMapping: getMetadataMapping(state),
    tags: getTagsFromStore(state),
  };
};
