import {
  ADD_BATCH_METADATA_ACTION,
  INIT_METADATA_ACTION,
  type MetadataAction,
  type MetadataDto,
  RESET_METADATA_ACTION,
  type SerializedMetadataContext,
} from "./metadata-types";

export const addBatchMetadataAction = (metadata: MetadataDto[]): MetadataAction => ({
  metadata,
  type: ADD_BATCH_METADATA_ACTION,
});

export const initMetadataAction = (context: SerializedMetadataContext): MetadataAction => ({
  context,
  type: INIT_METADATA_ACTION,
});

export const resetMetadataAction = (): MetadataAction => ({
  type: RESET_METADATA_ACTION,
});
