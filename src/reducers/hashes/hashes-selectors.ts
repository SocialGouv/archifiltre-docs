import { StoreState } from "../store";
import { HashesMap } from "./hashes-types";

/**
 * Gets the hashes map from the redux state
 * @param store - The current redux state
 */
export const getHashesFromStore = (store: StoreState): HashesMap =>
  store.hashes.hashes;
