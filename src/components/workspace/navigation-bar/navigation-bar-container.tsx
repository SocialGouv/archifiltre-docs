import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { moveElement } from "../../../reducers/files-and-folders/files-and-folders-thunks";
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

  const moveElementCallback = useCallback(
    (elementId, parentId) => dispatch(moveElement(elementId, parentId)),
    [dispatch]
  );

  return (
    <NavigationBar
      api={api}
      iciclesSortMethod={iciclesSortMethod}
      setIciclesSortMethod={setIciclesSortMethodCallback}
      moveElement={moveElementCallback}
    />
  );
};

export default NavigationBarContainer;
