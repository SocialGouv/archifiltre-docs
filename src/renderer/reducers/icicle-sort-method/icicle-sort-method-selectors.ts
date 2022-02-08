import { useSelector } from "react-redux";

import type { StoreState } from "../store";
import type { IcicleSortMethodState } from "./icicle-sort-method-types";

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
