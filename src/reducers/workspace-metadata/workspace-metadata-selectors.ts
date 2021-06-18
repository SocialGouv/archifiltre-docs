import { useSelector } from "react-redux";
import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import { StoreState } from "../store";
import { WorkspaceMetadataState } from "./workspace-metadata-types";

/**
 * Returns the workspace metadata from the redux store
 * @param store
 */
export const getWorkspaceMetadataFromStore = (
  store: StoreState
): WorkspaceMetadataState => getCurrentState(store.workspaceMetadata);

export const getSessionNameFromStore = (store: StoreState): string =>
  getWorkspaceMetadataFromStore(store).sessionName;

export const getLockedElementIdFromStore = (store: StoreState): string =>
  getWorkspaceMetadataFromStore(store).lockedElementId;

export const getHoveredElementIdFromStore = (store: StoreState): string =>
  getWorkspaceMetadataFromStore(store).hoveredElementId;

export const getOriginalPathFromStore = (store: StoreState): string =>
  getWorkspaceMetadataFromStore(store).originalPath;

/**
 * Hook to retrieve workspace metadata from the redux store
 */
export const useWorkspaceMetadata = (): WorkspaceMetadataState =>
  useSelector(getWorkspaceMetadataFromStore);
