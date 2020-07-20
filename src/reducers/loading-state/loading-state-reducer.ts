import {
  FileSystemLoadingStep,
  LoadingState,
  LoadingStateAction,
  LoadingStep,
  RESET_LOADING_STATE,
  SET_DATA_MODEL_ELEMENTS_COUNT,
  SET_DERIVED_ELEMENTS_COUNT,
  SET_FILE_SYSTEM_LOADING_STEP,
  SET_INDEXED_FILES_COUNT,
  SET_LOADING_STEP,
} from "./loading-state-types";
import undoable from "../enhancers/undoable/undoable";

export const initialState: LoadingState = {
  step: LoadingStep.WAITING,
  fileSystemLoadingStep: FileSystemLoadingStep.INDEXING,
  indexedFilesCount: 0,
  constructedDataModelElementsCount: 0,
  derivedElementsCount: 0,
};

export const loadingStateReducer = (
  state = initialState,
  action: LoadingStateAction
): LoadingState => {
  switch (action.type) {
    case RESET_LOADING_STATE:
      return initialState;
    case SET_LOADING_STEP:
      return {
        ...state,
        step: action.step,
      };
    case SET_FILE_SYSTEM_LOADING_STEP:
      return {
        ...state,
        fileSystemLoadingStep: action.step,
      };
    case SET_INDEXED_FILES_COUNT:
      return {
        ...state,
        indexedFilesCount: action.count,
      };
    case SET_DATA_MODEL_ELEMENTS_COUNT:
      return {
        ...state,
        constructedDataModelElementsCount: action.count,
      };
    case SET_DERIVED_ELEMENTS_COUNT:
      return {
        ...state,
        derivedElementsCount: action.count,
      };
    default:
      return state;
  }
};

export default undoable(loadingStateReducer, initialState);
