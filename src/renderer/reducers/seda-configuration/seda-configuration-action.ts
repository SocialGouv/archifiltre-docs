import type {
  SedaConfigurationAction,
  SedaMetadataMapping,
} from "./seda-configuration-type";
import {
  INIT_METADATA_MAPPING,
  SET_METADATA_MAPPING,
} from "./seda-configuration-type";

export const setSedaMappingAction = (
  mapping: SedaMetadataMapping
): SedaConfigurationAction => ({
  mapping,
  type: SET_METADATA_MAPPING,
});

export const initSedaMappingAction = (
  mapping: SedaMetadataMapping
): SedaConfigurationAction => ({
  mapping,
  type: INIT_METADATA_MAPPING,
});
