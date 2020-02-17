import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setIciclesSortMethod } from "../../../reducers/workspace-metadata/workspace-metadata-actions";
import { useWorkspaceMetadata } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { IciclesSortMethod } from "../../../reducers/workspace-metadata/workspace-metadata-types";
import NavigationBar from "./navigation-bar";

const NavigationBarContainer = ({ api }) => {
  const { iciclesSortMethod } = useWorkspaceMetadata();
  const dispatch = useDispatch();

  const setIciclesSortMethodCallback = useCallback(
    (sortMethod: IciclesSortMethod) =>
      dispatch(setIciclesSortMethod(sortMethod)),
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
