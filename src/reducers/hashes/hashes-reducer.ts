import {
  HashesActionTypes,
  HashesState,
  RESET_ERRORED_HASHES,
  ADD_ERRORED_HASHES,
  SET_FILES_AND_FOLDERS_HASHES,
} from "./hashes-types";

export const initialState: HashesState = {
  hashes: {},
  erroredHashes: [],
};

export const hashesReducer = (
  state = initialState,
  action: HashesActionTypes
): HashesState => {
  switch (action.type) {
    case SET_FILES_AND_FOLDERS_HASHES:
      return {
        ...state,
        hashes: {
          ...state.hashes,
          ...action.hashes,
        },
      };
    case RESET_ERRORED_HASHES:
      return {
        ...state,
        erroredHashes: [],
      };

    case ADD_ERRORED_HASHES:
      return {
        ...state,
        erroredHashes: action.hashErrors,
      };
  }
  return state;
};
