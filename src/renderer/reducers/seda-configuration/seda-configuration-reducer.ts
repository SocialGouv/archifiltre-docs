import {
  INIT_METADATA_MAPPING,
  RESET_METADATA_MAPPING,
  type SedaConfigurationAction,
  type SedaConfigurationState,
  SET_METADATA_MAPPING,
} from "./seda-configuration-type";

export const initialState: SedaConfigurationState = {
  metadataMapping: {},
};

export const sedaConfigurationReducer = (
  state = initialState,
  action?: SedaConfigurationAction,
): SedaConfigurationState => {
  switch (action?.type) {
    case SET_METADATA_MAPPING:
      return {
        metadataMapping: action.mapping,
      };
    case INIT_METADATA_MAPPING:
      return {
        metadataMapping: action.mapping,
      };
    case RESET_METADATA_MAPPING:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
