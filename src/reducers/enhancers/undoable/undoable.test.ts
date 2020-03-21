import undoable from "./undoable";
import { commitAction, redoAction, undoAction } from "./undoable-actions";

const state0 = {
  count: 0,
};
const state1 = {
  count: 1,
};

const state2 = {
  count: 2,
};

const state3 = {
  count: 3,
};

const state4 = {
  count: 4,
};

const testReducer = (state, action) => {
  if (action.type === "INCREMENT") {
    return {
      count: state.count + 1,
    };
  }
  return state;
};
const reducer = undoable(testReducer, state0);

const baseTestState = {
  current: state2,
  future: [state3, state4],
  past: [state1, state0],
  present: state2,
};

describe("undoable", () => {
  describe("defaultState", () => {
    it("should be initialize to the default state", () => {
      const nextState = reducer(undefined, {});

      expect(nextState).toEqual({
        current: state0,
        future: [],
        past: [],
        present: state0,
      });
    });
  });
  describe("UNDO", () => {
    it("should send the state back and update the history", () => {
      const nextState = reducer(baseTestState, undoAction());

      expect(nextState).toEqual({
        current: state1,
        future: [state2, state3, state4],
        past: [state0],
        present: state1,
      });
    });
  });

  describe("REDO", () => {
    it("should send the state forward and update the history", () => {
      const nextState = reducer(baseTestState, redoAction());

      expect(nextState).toEqual({
        current: state3,
        future: [state4],
        past: [state2, state1, state0],
        present: state3,
      });
    });
  });

  describe("COMMIT", () => {
    it("should add the state to the history and reset future states", () => {
      const nextState = reducer(baseTestState, commitAction());

      expect(nextState).toEqual({
        current: state2,
        future: [],
        past: [state2, state1, state0],
        present: state2,
      });
    });
  });

  describe("dispatched action to wrapped reducer", () => {
    it("should update the current state", () => {
      const nextState = reducer(baseTestState, { type: "INCREMENT" });

      expect(nextState).toEqual({
        current: {
          count: 3,
        },
        future: [state3, state4],
        past: [state1, state0],
        present: state2,
      });
    });
  });
});
