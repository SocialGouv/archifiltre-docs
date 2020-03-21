import {
  CLOSE_MODAL,
  ModalAction,
  ModalState,
  OPEN_MODAL,
} from "./modal-types";

export const initialState: ModalState = {
  openModal: null,
};

const modalReducer = (
  state = initialState,
  action: ModalAction
): ModalState => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        openModal: action.modal,
      };
    case CLOSE_MODAL:
      return {
        openModal: null,
      };
  }

  return state;
};

export default modalReducer;
