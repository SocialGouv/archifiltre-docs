import { useMemo } from "react";
import { FilterMethod } from "typings/filter-types";
import { applyFiltersList } from "util/array/array-util";

export const useFilters = <T>(array: T[], filters: FilterMethod<T>[]) => {
  return useMemo(() => applyFiltersList(array, filters), [array, filters]);
};
