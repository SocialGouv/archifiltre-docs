import { useSelector } from "react-redux";

import { type StoreState } from "../store";
import { type Modal } from "./modal-types";

/**
 * Returns the currently open modal from the store
 * @param store
 */
export const getOpenModalFromStore = (store: StoreState): Modal | null => store.modal.openModal;

/**
 * Hook that gets the currently open modal
 */
export const useOpenModal = (): Modal | null => useSelector(getOpenModalFromStore);
