import { useMemo } from "react";

import type { FilterMethod } from "../typings/filter-types";
import { applyFiltersList } from "../utils/array/array-util";

export const useFilters = <T>(array: T[], filters: FilterMethod<T>[]): T[] => {
  return useMemo(() => applyFiltersList(array, filters), [array, filters]);
};
