import type {
  MetadataAction,
  MetadataDto,
  SerializedMetadataContext,
} from "./metadata-types";
import {
  ADD_BATCH_METADATA_ACTION,
  INIT_METADATA_ACTION,
  RESET_METADATA_ACTION,
} from "./metadata-types";

export const addBatchMetadataAction = (
  metadata: MetadataDto[]
): MetadataAction => ({
  metadata,
  type: ADD_BATCH_METADATA_ACTION,
});

export const initMetadataAction = (
  context: SerializedMetadataContext
): MetadataAction => ({
  context,
  type: INIT_METADATA_ACTION,
});

export const resetMetadataAction = (): MetadataAction => ({
  type: RESET_METADATA_ACTION,
});
