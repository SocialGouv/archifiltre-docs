import type { ModalAction, ModalState } from "./modal-types";
import { CLOSE_MODAL, OPEN_MODAL } from "./modal-types";

export const initialState: ModalState = {
    openModal: null,
};

export const modalReducer = (
    state = initialState,
    action?: ModalAction
): ModalState => {
    switch (action?.type) {
        case OPEN_MODAL:
            return {
                openModal: action.modal,
            };
        case CLOSE_MODAL:
            return {
                openModal: null,
            };
        default:
            return state;
    }
};
