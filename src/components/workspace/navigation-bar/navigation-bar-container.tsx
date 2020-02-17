import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useWorkspaceMetadata } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { setIciclesSortMethodThunk } from "../../../reducers/workspace-metadata/workspace-metadata-thunk";
import { IciclesSortMethod } from "../../../reducers/workspace-metadata/workspace-metadata-types";
import NavigationBar from "./navigation-bar";

const NavigationBarContainer = ({ api }) => {
  const { iciclesSortMethod } = useWorkspaceMetadata();
  const dispatch = useDispatch();

  const setIciclesSortMethodCallback = useCallback(
    (sortMethod: IciclesSortMethod) =>
      dispatch(setIciclesSortMethodThunk(sortMethod)),
    [dispatch]
  );

  return (
    <NavigationBar
      api={api}
      iciclesSortMethod={iciclesSortMethod}
      setIciclesSortMethod={setIciclesSortMethodCallback}
    />
  );
};

export default NavigationBarContainer;
