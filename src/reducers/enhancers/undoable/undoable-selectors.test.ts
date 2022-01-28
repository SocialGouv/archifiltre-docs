import { getCurrentState } from "./undoable-selectors";
import type { UndoableState } from "./undoable-types";

describe("undoable-selectors", () => {
  describe("getCurrentState", () => {
    it("should return the present state", () => {
      interface TestState {
        value: string;
      }
      const current = {
        value: "test-value",
      };
      const undoableState: UndoableState<TestState> = {
        current,
        future: [],
        past: [],
        present: {
          value: "present-value",
        },
      };

      expect(getCurrentState(undoableState)).toEqual(current);
    });
  });
});
