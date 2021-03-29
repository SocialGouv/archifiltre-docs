import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setLockedElementId } from "reducers/workspace-metadata/workspace-metadata-actions";
import { NavigationBar } from "./navigation-bar";
import {
  ElementWeightMethod,
  IcicleColorMode,
  IcicleSortMethod,
} from "reducers/icicle-sort-method/icicle-sort-method-types";
import {
  setElementWeightMethodThunk,
  setIcicleColorModeThunk,
  setIcicleSortMethodThunk,
} from "reducers/icicle-sort-method/icicle-sort-method-thunk";
import { useIcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-selectors";
import { useIsZoomed } from "reducers/main-space-selection/main-space-selection-selectors";
import { resetZoom } from "reducers/main-space-selection/main-space-selection-action";

const NavigationBarContainer = () => {
  const {
    icicleSortMethod,
    elementWeightMethod,
    icicleColorMode,
  } = useIcicleSortMethod();
  const dispatch = useDispatch();

  const setIcicleSortMethodCallback = useCallback(
    (sortMethod: IcicleSortMethod) =>
      dispatch(setIcicleSortMethodThunk(sortMethod)),
    [dispatch]
  );

  const isZoomed = useIsZoomed();

  const setNoFocus = useCallback(() => dispatch(setLockedElementId("")), [
    dispatch,
  ]);

  const resetZoomCallback = useCallback(() => dispatch(resetZoom()), [
    dispatch,
  ]);

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
      isZoomed={isZoomed}
      icicleSortMethod={icicleSortMethod}
      setIcicleSortMethod={setIcicleSortMethodCallback}
      setNoFocus={setNoFocus}
      resetZoom={resetZoomCallback}
      setElementWeightMethod={setElementWeightMethodCallback}
      setIcicleColorMode={setIcicleColorModeCallback}
    />
  );
};

export default NavigationBarContainer;
