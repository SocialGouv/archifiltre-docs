import { LoadingInfo, LoadingInfoTypes } from "./loading-info-types";

interface CreateLoadingInfoParams {
  id: string;
  type?: LoadingInfoTypes;
  progress?: number;
  goal?: number;
  label?: string;
  loadedLabel?: string;
}

const DEFAULT_PROGRESS = 10;
const DEFAULT_GOAL = 100;
const DEFAULT_LABEL = "test-label";
const DEFAULT_LOADED_LABEL = "test-loaded-label";

export const createLoadingInfo = ({
  id,
  type = LoadingInfoTypes.HASH_COMPUTING,
  progress = DEFAULT_PROGRESS,
  goal = DEFAULT_GOAL,
  label = DEFAULT_LABEL,
  loadedLabel = DEFAULT_LOADED_LABEL,
}: CreateLoadingInfoParams): LoadingInfo => ({
  goal,
  id,
  label,
  progress,
  type,
  loadedLabel,
});
