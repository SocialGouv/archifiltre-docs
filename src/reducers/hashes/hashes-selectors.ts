import { StoreState } from "../store";
import { HashesMap } from "./hashes-types";
import { useSelector } from "react-redux";
import { ArchifiltreError } from "util/error/error-util";

/**
 * Gets the hashes map from the redux state
 * @param store - The current redux state
 */
export const getHashesFromStore = (store: StoreState): HashesMap =>
  store.hashes.hashes;

/**
 * Gets the errored hashes paths from the store
 * @param store
 */
export const getErroredHashesFromStore = (
  store: StoreState
): ArchifiltreError[] => store.hashes.erroredHashes;

/**
 * Hook to get the hash computation errors
 */
export const useHashesErrors = (): ArchifiltreError[] =>
  useSelector(getErroredHashesFromStore);
