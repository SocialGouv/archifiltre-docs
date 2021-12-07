import type {
    IcicleSortMethodAction,
    IcicleSortMethodState,
} from "./icicle-sort-method-types";
import {
    ElementWeightMethod,
    IcicleColorMode,
    IcicleSortMethod,
    SET_ELEMENT_WEIGHT_METHOD,
    SET_ICICLE_COLOR_MODE,
    SET_ICICLE_SORT_METHOD,
} from "./icicle-sort-method-types";

export const initialState: IcicleSortMethodState = {
    elementWeightMethod: ElementWeightMethod.BY_VOLUME,
    icicleColorMode: IcicleColorMode.BY_TYPE,
    icicleSortMethod: IcicleSortMethod.SORT_BY_SIZE,
};

export const icicleSortMethodReducer = (
    state = initialState,
    action?: IcicleSortMethodAction
): IcicleSortMethodState => {
    switch (action?.type) {
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
