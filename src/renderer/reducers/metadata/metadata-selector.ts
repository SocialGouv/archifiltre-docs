import { useSelector } from "react-redux";

import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import type { StoreState } from "../store";
import { getMetadataByEntityId } from "./metadata-operations";
import type { EntityId, Metadata } from "./metadata-types";

const getMetadataContextFromState = (state: StoreState) =>
  getCurrentState(state.metadata).context;

export const useMetadataByEntityId = (entityId: EntityId): Metadata[] =>
  useSelector((state: StoreState) =>
    getMetadataByEntityId(getMetadataContextFromState(state), entityId)
  );
