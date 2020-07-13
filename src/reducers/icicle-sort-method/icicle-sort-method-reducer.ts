import {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
  IcicleSortMethodAction,
  IcicleSortMethodState,
  SET_ELEMENT_WEIGHT_METHOD,
  SET_ICICLE_COLOR_MODE,
  SET_ICICLE_SORT_METHOD,
} from "reducers/icicle-sort-method/icicle-sort-method-types";

export const initialState: IcicleSortMethodState = {
  icicleSortMethod: IcicleSortMethod.SORT_BY_SIZE,
  elementWeightMethod: ElementWeightMethod.BY_VOLUME,
  icicleColorMode: IcicleColorMode.BY_TYPE,
};

const icicleSortMethodReducer = (
  state = initialState,
  action: IcicleSortMethodAction
) => {
  switch (action.type) {
    case SET_ICICLE_SORT_METHOD:
      return { ...state, icicleSortMethod: action.sortMethod };
    case SET_ELEMENT_WEIGHT_METHOD:
      return {
        ...state,
        elementWeightMethod: action.weightMethod,
      };
    case SET_ICICLE_COLOR_MODE:
      return {
        ...state,
        icicleColorMode: action.colorMode,
      };
    default:
      return state;
  }
};

export default icicleSortMethodReducer;
