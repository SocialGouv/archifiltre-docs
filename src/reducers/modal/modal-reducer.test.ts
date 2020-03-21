import modalReducer, { initialState } from "./modal-reducer";
import { closeModalAction, openModalAction } from "./modal-actions";
import { Modal } from "./modal-types";

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
