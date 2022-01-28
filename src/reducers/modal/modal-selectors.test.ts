import type { StoreState } from "../store";
import { createEmptyStore } from "../store-test-utils";
import { initialState } from "./modal-reducer";
import { getOpenModalFromStore } from "./modal-selectors";
import { Modal } from "./modal-types";

const store: StoreState = {
  ...createEmptyStore(),
  modal: {
    ...initialState,
    openModal: Modal.ERROR_MODAL,
  },
};

describe("getOpenModalFromStore", () => {
  it("should return the currently open modal", () => {
    expect(getOpenModalFromStore(store)).toBe(Modal.ERROR_MODAL);
  });
});
