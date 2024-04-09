import path from "path";
import { useSelector } from "react-redux";

import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import { type StoreState } from "../store";
import { type WorkspaceMetadataState } from "./workspace-metadata-types";

/**
 * Returns the workspace metadata from the redux store
 * @param store
 */
export const getWorkspaceMetadataFromStore = (store: StoreState): WorkspaceMetadataState =>
  getCurrentState(store.workspaceMetadata);

export const getSessionNameFromStore = (store: StoreState): string => getWorkspaceMetadataFromStore(store).sessionName;

export const getLockedElementIdFromStore = (store: StoreState): string =>
  getWorkspaceMetadataFromStore(store).lockedElementId;

export const getHoveredElementIdFromStore = (store: StoreState): string =>
  getWorkspaceMetadataFromStore(store).hoveredElementId;

export const getOriginalPathFromStore = (store: StoreState): string =>
  getWorkspaceMetadataFromStore(store).originalPath;

/**
 * Hook to retrieve workspace metadata from the redux store
 */
export const useWorkspaceMetadata = (): WorkspaceMetadataState => useSelector(getWorkspaceMetadataFromStore);

/**
 * Hook to get the currently active element
 */
export const useActiveElement = (): string => {
  const { hoveredElementId, lockedElementId } = useWorkspaceMetadata();

  return lockedElementId || hoveredElementId;
};

export const useElementAbsolutePath = (elementPath: string): string => {
  const originalPath = useOriginalPath();

  return path.join(originalPath, "..", elementPath);
};

const useOriginalPath = () => useSelector(getOriginalPathFromStore);
