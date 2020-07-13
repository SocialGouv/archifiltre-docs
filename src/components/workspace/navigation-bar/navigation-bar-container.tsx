import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setLockedElementId } from "reducers/workspace-metadata/workspace-metadata-actions";
import { NavigationBar } from "./navigation-bar";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { setIcicleSortMethodThunk } from "reducers/icicle-sort-method/icicle-sort-method-thunk";
import { useIcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-selectors";
import { useIsZoomed } from "reducers/main-space-selection/main-space-selection-selectors";
import { resetZoom } from "reducers/main-space-selection/main-space-selection-action";

const NavigationBarContainer = ({ api }) => {
  const icicleSortMethod = useIcicleSortMethod();
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

  return (
    <NavigationBar
      api={api}
      isZoomed={isZoomed}
      icicleSortMethod={icicleSortMethod}
      setIcicleSortMethod={setIcicleSortMethodCallback}
      setNoFocus={setNoFocus}
      resetZoom={resetZoomCallback}
    />
  );
};

export default NavigationBarContainer;
