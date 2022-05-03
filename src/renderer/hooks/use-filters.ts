import { applyFiltersList } from "@common/utils/array";
import type { FilterMethod } from "@common/utils/type";
import { useMemo } from "react";

export const useFilters = <T>(array: T[], filters: FilterMethod<T>[]): T[] => {
  return useMemo(() => applyFiltersList(array, filters), [array, filters]);
};
