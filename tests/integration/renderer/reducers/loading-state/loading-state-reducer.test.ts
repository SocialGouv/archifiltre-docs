import {
  resetLoadingState,
  setConstructedDataModelElementsCount,
  setDerivedElementsCount,
  setFileSystemLoadingStep,
  setIndexedFilesCount,
  setLoadingStep,
} from "@renderer/reducers/loading-state/loading-state-actions";
import {
  initialState,
  loadingStateReducer,
} from "@renderer/reducers/loading-state/loading-state-reducer";
import {
  FileSystemLoadingStep,
  LoadingStep,
} from "@renderer/reducers/loading-state/loading-state-types";

describe("loading-state-reducer", () => {
  describe("RESET_LOADING_STATE", () => {
    it("should reset the state", () => {
      const prevState = {
        ...initialState,
        indexedFilesCount: 20,
        step: LoadingStep.FINISHED,
      };

      expect(loadingStateReducer(prevState, resetLoadingState())).toEqual(
        initialState
      );
    });
  });

  describe("SET_LOADING_STEP", () => {
    it("should update the loading step", () => {
      const nextStep = LoadingStep.FINISHED;
      const nextState = loadingStateReducer(
        initialState,
        setLoadingStep(nextStep)
      );

      expect(nextState).toEqual({
        ...initialState,
        step: nextStep,
      });
    });
  });

  describe("SET_FILE_SYSTEM_LOADING_STEP", () => {
    it("should update the loading step", () => {
      const nextStep = FileSystemLoadingStep.METADATA;
      const nextState = loadingStateReducer(
        initialState,
        setFileSystemLoadingStep(nextStep)
      );

      expect(nextState).toEqual({
        ...initialState,
        fileSystemLoadingStep: nextStep,
      });
    });
  });

  describe("SET_INDEXED_FILES_COUNT", () => {
    it("should set the indexed files count", () => {
      expect(
        loadingStateReducer(initialState, setIndexedFilesCount(20))
      ).toEqual({
        ...initialState,
        indexedFilesCount: 20,
      });
    });
  });

  describe("SET_DATA_MODEL_ELEMENTS_COUNT", () => {
    it("should set the datamodel files count", () => {
      expect(
        loadingStateReducer(
          initialState,
          setConstructedDataModelElementsCount(20)
        )
      ).toEqual({
        ...initialState,
        constructedDataModelElementsCount: 20,
      });
    });
  });

  describe("SET_DERIVED_ELEMENTS_COUNT", () => {
    it("should set the derived files count", () => {
      expect(
        loadingStateReducer(initialState, setDerivedElementsCount(20))
      ).toEqual({
        ...initialState,
        derivedElementsCount: 20,
      });
    });
  });
});
