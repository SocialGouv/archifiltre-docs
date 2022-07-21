import type { Action } from "redux";

export type MetadataId = number;
export type EntityId = string;

export interface Metadata {
  content: string;
  entity: EntityId;
  id: MetadataId;
  name: string;
}

export type EntityMetadataIndex = Map<EntityId, MetadataId[]>;
export type MetadataMap = Map<MetadataId, Metadata>;

export interface MetadataContext {
  entityMetadataIndex: EntityMetadataIndex;
  id: MetadataId;
  metadata: MetadataMap;
}

export type MetadataDto = Omit<Metadata, "id">;

export interface MetadataState {
  context: MetadataContext;
}

export const ADD_BATCH_METADATA_ACTION = "ADD_BATCH_METADATA_ACTION";

export interface AddBatchMetadataAction extends Action {
  metadata: MetadataDto[];
  type: typeof ADD_BATCH_METADATA_ACTION;
}

export type MetadataAction = AddBatchMetadataAction;
