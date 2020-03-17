import { CLOSE_MODAL, Modal, ModalAction, OPEN_MODAL } from "./modal-types";

export const openModalAction = (modal: Modal): ModalAction => ({
  modal,
  type: OPEN_MODAL
});

export const closeModalAction = (): ModalAction => ({
  type: CLOSE_MODAL
});
