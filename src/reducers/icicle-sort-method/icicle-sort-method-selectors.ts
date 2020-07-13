import { StoreState } from "reducers/store";
import { useSelector } from "react-redux";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";

/**
 * Retrieves the icicle sort method from the store.
 * @param store
 */
export const getIcicleSortMethodFromStore = (store: StoreState) =>
  store.icicleSortMethod.icicleSortMethod;

/**
 * Hook that return the current IcicleSortMethod
 */
export const useIcicleSortMethod = (): IcicleSortMethod =>
  useSelector(getIcicleSortMethodFromStore);
