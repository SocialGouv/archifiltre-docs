import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useIcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-selectors";
import {
    setElementWeightMethodThunk,
    setIcicleColorModeThunk,
    setIcicleSortMethodThunk,
} from "reducers/icicle-sort-method/icicle-sort-method-thunk";
import type {
    ElementWeightMethod,
    IcicleColorMode,
    IcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-types";

import { NavigationBar } from "./navigation-bar";

const NavigationBarContainer = () => {
    const { icicleSortMethod, elementWeightMethod, icicleColorMode } =
        useIcicleSortMethod();
    const dispatch = useDispatch();

    const setIcicleSortMethodCallback = useCallback(
        (sortMethod: IcicleSortMethod) =>
            dispatch(setIcicleSortMethodThunk(sortMethod)),
        [dispatch]
    );

    const setElementWeightMethodCallback = useCallback(
        (method: ElementWeightMethod) =>
            dispatch(setElementWeightMethodThunk(method)),
        [dispatch]
    );

    const setIcicleColorModeCallback = useCallback(
        (mode: IcicleColorMode) => dispatch(setIcicleColorModeThunk(mode)),
        [dispatch]
    );

    return (
        <NavigationBar
            elementWeightMethod={elementWeightMethod}
            icicleColorMode={icicleColorMode}
            icicleSortMethod={icicleSortMethod}
            setIcicleSortMethod={setIcicleSortMethodCallback}
            setElementWeightMethod={setElementWeightMethodCallback}
            setIcicleColorMode={setIcicleColorModeCallback}
        />
    );
};

export default NavigationBarContainer;
