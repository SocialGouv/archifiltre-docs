import { initialState } from "@renderer/reducers/modal/modal-reducer";
import { getOpenModalFromStore } from "@renderer/reducers/modal/modal-selectors";
import { Modal } from "@renderer/reducers/modal/modal-types";
import type { StoreState } from "@renderer/reducers/store";

import { createEmptyStore } from "../store-test-utils";

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
