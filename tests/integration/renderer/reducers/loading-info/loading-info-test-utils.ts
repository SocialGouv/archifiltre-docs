import type { LoadingInfo } from "@renderer/reducers/loading-info/loading-info-types";
import { LoadingInfoTypes } from "@renderer/reducers/loading-info/loading-info-types";

interface CreateLoadingInfoParams {
  goal?: number;
  id: string;
  label?: string;
  loadedLabel?: string;
  progress?: number;
  type?: LoadingInfoTypes;
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
  loadedLabel,
  progress,
  type,
});
