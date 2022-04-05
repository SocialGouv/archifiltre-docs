import {
  closeModalAction,
  openModalAction,
} from "@renderer/reducers/modal/modal-actions";
import {
  initialState,
  modalReducer,
} from "@renderer/reducers/modal/modal-reducer";
import { Modal } from "@renderer/reducers/modal/modal-types";

describe("modal-reducer", () => {
  describe("OPEN_MODAL", () => {
    it("should set the open modal", () => {
      const nextState = modalReducer(
        initialState,
        openModalAction(Modal.ERROR_MODAL)
      );
      expect(nextState).toEqual({
        ...initialState,
        openModal: Modal.ERROR_MODAL,
      });
    });
  });

  describe("CLOSE_MODAL", () => {
    it("should set the open modal to null", () => {
      const baseState = {
        ...initialState,
        openModal: Modal.ERROR_MODAL,
      };
      const nextState = modalReducer(baseState, closeModalAction());

      expect(nextState).toEqual({
        ...initialState,
        openModal: null,
      });
    });
  });
});
