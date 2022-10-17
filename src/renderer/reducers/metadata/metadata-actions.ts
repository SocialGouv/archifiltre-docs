import type { MetadataAction, MetadataDto } from "./metadata-types";
import { ADD_BATCH_METADATA_ACTION } from "./metadata-types";

export const addBatchMetadataAction = (
  metadata: MetadataDto[]
): MetadataAction => ({
  metadata,
  type: ADD_BATCH_METADATA_ACTION,
});
