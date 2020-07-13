import {
  IcicleSortMethod,
  IcicleSortMethodAction,
  IcicleSortMethodState,
  SET_ICICLE_SORT_METHOD,
} from "reducers/icicle-sort-method/icicle-sort-method-types";

export const initialState: IcicleSortMethodState = {
  icicleSortMethod: IcicleSortMethod.SORT_BY_TYPE,
};

const icicleSortMethodReducer = (
  state = initialState,
  action: IcicleSortMethodAction
) => {
  switch (action.type) {
    case SET_ICICLE_SORT_METHOD:
      return { ...state, icicleSortMethod: action.sortMethod };
    default:
      return state;
  }
};

export default icicleSortMethodReducer;
