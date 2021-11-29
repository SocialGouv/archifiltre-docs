import { useSelector } from "react-redux";
import type { IcicleSortMethodState } from "reducers/icicle-sort-method/icicle-sort-method-types";
import type { StoreState } from "reducers/store";

/**
 * Retrieves the icicle sort method from the store.
 * @param store
 */
export const getIcicleSortMethodFromStore = (
    store: StoreState
): IcicleSortMethodState => store.icicleSortMethod;

/**
 * Hook that return the current IcicleSortMethod
 */
export const useIcicleSortMethod = (): IcicleSortMethodState =>
    useSelector(getIcicleSortMethodFromStore);
