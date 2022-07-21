import { useSelector } from "react-redux";

import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import type { StoreState } from "../store";
import { getMetadataByEntityId } from "./metadata-operations";
import type { EntityId } from "./metadata-types";

const getMetadataContextFromState = (state: StoreState) => {
  console.log(getCurrentState(state.metadata).context);
  return getCurrentState(state.metadata).context;
};

export const useMetadataByEntityId = (entityId: EntityId) => {
  const metadata = useSelector((state: StoreState) =>
    getMetadataByEntityId(getMetadataContextFromState(state), entityId)
  );

  console.log(entityId);

  return metadata;
};
