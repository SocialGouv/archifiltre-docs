import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setLockedElementId } from "reducers/workspace-metadata/workspace-metadata-actions";
import { NavigationBar } from "./navigation-bar";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import { setIcicleSortMethodThunk } from "reducers/icicle-sort-method/icicle-sort-method-thunk";
import { useIcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-selectors";

const NavigationBarContainer = ({ api }) => {
  const icicleSortMethod = useIcicleSortMethod();
  const dispatch = useDispatch();

  const setIcicleSortMethodCallback = useCallback(
    (sortMethod: IcicleSortMethod) =>
      dispatch(setIcicleSortMethodThunk(sortMethod)),
    [dispatch]
  );

  const setNoFocus = useCallback(() => dispatch(setLockedElementId("")), [
    dispatch,
  ]);

  return (
    <NavigationBar
      api={api}
      icicleSortMethod={icicleSortMethod}
      setIcicleSortMethod={setIcicleSortMethodCallback}
      setNoFocus={setNoFocus}
    />
  );
};

export default NavigationBarContainer;
