import {
  INIT_METADATA_MAPPING,
  RESET_METADATA_MAPPING,
  type SedaConfigurationAction,
  type SedaMetadataMapping,
  SET_METADATA_MAPPING,
} from "./seda-configuration-type";

export const setSedaMappingAction = (mapping: SedaMetadataMapping): SedaConfigurationAction => ({
  mapping,
  type: SET_METADATA_MAPPING,
});

export const initSedaMappingAction = (mapping: SedaMetadataMapping): SedaConfigurationAction => ({
  mapping,
  type: INIT_METADATA_MAPPING,
});

export const resetSedaMappingAction = (): SedaConfigurationAction => ({
  type: RESET_METADATA_MAPPING,
});
