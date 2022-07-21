import { undoable } from "../enhancers/undoable/undoable";
import { addBatchMetadata, createMetadataContext } from "./metadata-operations";
import type { MetadataAction, MetadataState } from "./metadata-types";
import { ADD_BATCH_METADATA_ACTION } from "./metadata-types";

export const initialState: MetadataState = {
  context: createMetadataContext(),
};

export const metadataReducer = undoable(
  (state = initialState, action?: MetadataAction): MetadataState => {
    switch (action?.type) {
      case ADD_BATCH_METADATA_ACTION:
        return {
          ...state,
          context: addBatchMetadata(state.context, action.metadata),
        };
      default:
        return state;
    }
  },
  initialState
);
