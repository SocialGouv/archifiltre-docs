import type {
  SedaConfigurationAction,
  SedaMetadataMapping,
} from "./seda-configuration-type";
import { SET_METADATA_MAPPING } from "./seda-configuration-type";

export const setSedaMappingAction = (
  mapping: SedaMetadataMapping
): SedaConfigurationAction => ({
  mapping,
  type: SET_METADATA_MAPPING,
});
