import {
  COMPLETE_LOADING,
  DISMISS_ALL_COMPLETE,
  type LoadingInfoAction,
  type LoadingInfoState,
  PROGRESS_LOADING,
  REGISTER_ERROR,
  RESET_LOADING,
  START_LOADING,
  UPDATE_LOADING,
} from "./loading-info-types";

export const initialState: LoadingInfoState = {
  complete: [],
  dismissed: [],
  errors: [],
  loading: [],
  loadingInfo: {},
};

export const loadingInfoReducer = (state = initialState, action?: LoadingInfoAction): LoadingInfoState => {
  /* eslint-disable no-case-declarations */
  switch (action?.type) {
    case START_LOADING:
      return {
        ...state,
        loading: [...state.loading, action.id],
        loadingInfo: {
          ...state.loadingInfo,
          [action.id]: {
            goal: action.goal,
            id: action.id,
            label: action.label,
            loadedLabel: action.loadedLabel,
            progress: 0,
            type: action.loadingType,
          },
        },
      };
    case UPDATE_LOADING:
      const loadingInfo = state.loadingInfo[action.id];

      if (!loadingInfo) {
        return state;
      }
      return {
        ...state,
        loadingInfo: {
          ...state.loadingInfo,
          [action.id]: {
            ...loadingInfo,

            goal: action.goal || loadingInfo.goal,

            progress: action.progress || loadingInfo.progress,
          },
        },
      };

    case PROGRESS_LOADING:
      if (!state.loadingInfo[action.id]) {
        return state;
      }
      const currentLoadingInfo = state.loadingInfo[action.id];
      return {
        ...state,
        loadingInfo: {
          ...state.loadingInfo,
          [action.id]: {
            ...currentLoadingInfo,
            progress: currentLoadingInfo.progress + action.progress,
          },
        },
      };

    case COMPLETE_LOADING:
      if (!state.loadingInfo[action.id]) {
        return state;
      }
      return {
        ...state,
        complete: [...state.complete, action.id],
        loading: state.loading.filter(id => id !== action.id),
      };

    case REGISTER_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.error],
      };

    case RESET_LOADING:
      return initialState;

    case DISMISS_ALL_COMPLETE:
      return {
        ...state,
        complete: [],
        dismissed: [...state.dismissed, ...state.complete],
      };
    default:
      return state;
  }
};
