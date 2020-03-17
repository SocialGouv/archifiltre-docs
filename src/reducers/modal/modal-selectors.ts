import { StoreState } from "../store";
import { Modal } from "./modal-types";
import { useSelector } from "react-redux";

/**
 * Returns the currently open modal from the store
 * @param store
 */
export const getOpenModalFromStore = (store: StoreState): Modal | null =>
  store.modal.openModal;

/**
 * Hook that gets the currently open modal
 */
export const useOpenModal = (): Modal | null =>
  useSelector(getOpenModalFromStore);
