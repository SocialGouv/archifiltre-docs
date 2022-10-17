import type {
  SedaConfigurationAction,
  SedaConfigurationState,
} from "./seda-configuration-type";
import { SET_METADATA_MAPPING } from "./seda-configuration-type";

export const initialState: SedaConfigurationState = {
  metadataMapping: {},
};

export const sedaConfigurationReducer = (
  state = initialState,
  action?: SedaConfigurationAction
): SedaConfigurationState => {
  switch (action?.type) {
    case SET_METADATA_MAPPING:
      return {
        metadataMapping: action.mapping,
      };
    default:
      return state;
  }
};
