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
