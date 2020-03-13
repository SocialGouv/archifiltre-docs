import {
  ArchifiltreError,
  ArchifiltreErrorType,
  LoadingInfo,
  LoadingInfoTypes
} from "./loading-info-types";

interface CreateLoadingInfoParams {
  id: string;
  type?: LoadingInfoTypes;
  progress?: number;
  goal?: number;
  label?: string;
}

const DEFAULT_PROGRESS = 10;
const DEFAULT_GOAL = 100;
const DEFAULT_LABEL = "test-label";

export const createLoadingInfo = ({
  id,
  type = LoadingInfoTypes.HASH_COMPUTING,
  progress = DEFAULT_PROGRESS,
  goal = DEFAULT_GOAL,
  label = DEFAULT_LABEL
}: CreateLoadingInfoParams): LoadingInfo => ({
  goal,
  id,
  label,
  progress,
  type
});
