import type { FilterMethod } from "@common/utils/type";

import { useFilters } from "./use-filters";

export const useSearchAndFilters = <T>(
  elementsArray: T[],
  filterMethods: FilterMethod<T>[]
): T[] => useFilters<T>(elementsArray, filterMethods);
