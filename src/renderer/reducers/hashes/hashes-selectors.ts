import { type ArchifiltreDocsError } from "@common/utils/error";
import { type HashesMap } from "@common/utils/hashes-types";
import { useSelector } from "react-redux";

import { type StoreState } from "../store";

/**
 * Gets the hashes map from the redux state
 * @param store - The current redux state
 */
export const getHashesFromStore = (store: StoreState): HashesMap => store.hashes.hashes;

/**
 * Gets the errored hashes paths from the store
 * @param store
 */
export const getErroredHashesFromStore = (store: StoreState): ArchifiltreDocsError[] => store.hashes.erroredHashes;

/**
 * Hook to get the hash computation errors
 */
export const useHashesErrors = (): ArchifiltreDocsError[] => useSelector(getErroredHashesFromStore);
