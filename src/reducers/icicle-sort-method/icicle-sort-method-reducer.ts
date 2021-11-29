import type {
    IcicleSortMethodAction,
    IcicleSortMethodState,
} from "reducers/icicle-sort-method/icicle-sort-method-types";
import {
    ElementWeightMethod,
    IcicleColorMode,
    IcicleSortMethod,
    SET_ELEMENT_WEIGHT_METHOD,
    SET_ICICLE_COLOR_MODE,
    SET_ICICLE_SORT_METHOD,
} from "reducers/icicle-sort-method/icicle-sort-method-types";

export const initialState: IcicleSortMethodState = {
    elementWeightMethod: ElementWeightMethod.BY_VOLUME,
    icicleColorMode: IcicleColorMode.BY_TYPE,
    icicleSortMethod: IcicleSortMethod.SORT_BY_SIZE,
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
