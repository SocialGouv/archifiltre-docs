import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsonExporterThunk } from "exporters/json/json-exporter";
import { resetStoreThunk } from "reducers/store-thunks";
import {
  getSessionNameFromStore,
  getOriginalPathFromStore,
} from "reducers/workspace-metadata/workspace-metadata-selectors";
import Header from "components/header/header";
import {
  redoAction,
  undoAction,
} from "reducers/enhancers/undoable/undoable-actions";
import { StoreState } from "reducers/store";
import {
  canStateRedo,
  canStateUndo,
} from "reducers/enhancers/undoable/undoable-selectors";

const HeaderContainer: FC = () => {
  const dispatch = useDispatch();

  const undo = useCallback(() => {
    dispatch(undoAction());
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch(redoAction());
  }, [dispatch]);

  const canRedo = useSelector((store: StoreState) =>
    canStateRedo(store.filesAndFolders)
  );
  const canUndo = useSelector((store: StoreState) =>
    canStateUndo(store.filesAndFolders)
  );

  const exportToJson = useCallback(
    ({ sessionName: newSessionName, originalPath: newOriginalPath, version }) =>
      dispatch(
        jsonExporterThunk({
          originalPath: newOriginalPath,
          sessionName: newSessionName,
          version,
        })
      ),
    [dispatch]
  );

  const resetWorkspace = useCallback(() => dispatch(resetStoreThunk()), [
    dispatch,
  ]);

  const sessionName = useSelector(getSessionNameFromStore);
  const originalPath = useSelector(getOriginalPathFromStore);

  return (
    <Header
      originalPath={originalPath}
      sessionName={sessionName}
      exportToJson={exportToJson}
      resetWorkspace={resetWorkspace}
      undo={undo}
      redo={redo}
      canRedo={canRedo}
      canUndo={canUndo}
    />
  );
};

export default HeaderContainer;
