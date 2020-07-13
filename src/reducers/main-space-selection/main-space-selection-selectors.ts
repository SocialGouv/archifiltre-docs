import { StoreState } from "reducers/store";
import { MainSpaceSelectionState } from "reducers/main-space-selection/main-space-selection-types";
import { useSelector } from "react-redux";
import { ROOT_FF_ID } from "reducers/files-and-folders/files-and-folders-selectors";

/**
 * Retrieve main space selection state from the store
 * @param store
 */
export const getMainSpaceSelectionFromStore = (
  store: StoreState
): MainSpaceSelectionState => store.mainSpaceSelection;

/**
 * Hook that returns the zoomed element Id
 */
export const useZoomedElement = (): string =>
  useSelector(
    (store: StoreState) => getMainSpaceSelectionFromStore(store).zoomedElementId
  );

export const useIsZoomed = () =>
  useSelector(
    (store: StoreState): boolean =>
      getMainSpaceSelectionFromStore(store).zoomedElementId !== ROOT_FF_ID
  );
