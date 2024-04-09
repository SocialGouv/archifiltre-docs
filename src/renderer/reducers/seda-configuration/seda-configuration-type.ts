import { type SimpleObject } from "@common/utils/object";

export const SET_METADATA_MAPPING = "SEDA/SET_METADATA_MAPPING";
export const INIT_METADATA_MAPPING = "SEDA/INIT_METADATA_MAPPING";
export const RESET_METADATA_MAPPING = "SEDA/RESET_METADATA_MAPPING";

export const sedaFields = ["CustodialHistory", "Title", "ArchivalAgencyArchiveUnitIdentifier", "Tags"] as const;

export type SedaField = (typeof sedaFields)[number];

export interface ActiveSedaFields {
  fields: Set<string>;
  tags: Set<string>;
}

export type SedaMetadataMapping = SimpleObject<SedaField>;

export interface SedaConfigurationState {
  metadataMapping: SedaMetadataMapping;
}

interface SetMetadataMappingAction {
  mapping: SedaMetadataMapping;
  type: typeof SET_METADATA_MAPPING;
}

interface InitMetadataMappingAction {
  mapping: SedaMetadataMapping;
  type: typeof INIT_METADATA_MAPPING;
}

interface ResetMetadataMappingAction {
  type: typeof RESET_METADATA_MAPPING;
}
export interface SedaMetadata {
  content: string;
  entity: string;
  id: number;
  name: SedaField;
}

export type SedaMetadataMap = SimpleObject<SedaMetadata[]>;

export type SedaConfigurationAction = InitMetadataMappingAction | ResetMetadataMappingAction | SetMetadataMappingAction;
