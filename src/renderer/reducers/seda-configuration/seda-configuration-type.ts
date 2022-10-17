export const SET_METADATA_MAPPING = "SEDA/SET_METADATA_MAPPING";

export const sedaFields: SedaField[] = [
  "CustodialHistory",
  "Title",
  "ArchivalAgencyArchiveUnitIdentifier",
  "Tags",
];

export type SedaField =
  | "ArchivalAgencyArchiveUnitIdentifier"
  | "CustodialHistory"
  | "Tags"
  | "Title";

export interface ActiveSedaFields {
  fields: Set<string>;
  tags: Set<string>;
}

export type SedaMetadataMapping = Record<string, SedaField>;

export interface SedaConfigurationState {
  metadataMapping: SedaMetadataMapping;
}

interface SetMetadataMappingAction {
  mapping: SedaMetadataMapping;
  type: typeof SET_METADATA_MAPPING;
}

export type SedaConfigurationAction = SetMetadataMappingAction;
