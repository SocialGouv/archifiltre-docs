import {
  HashesActionTypes,
  HashesState,
  SET_FILES_AND_FOLDERS_HASHES,
} from "./hashes-types";

export const initialState: HashesState = {
  hashes: {},
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
  }
  return state;
};
