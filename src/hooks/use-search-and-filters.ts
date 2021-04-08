import { FilterMethod } from "typings/filter-types";
import { useFilters } from "./use-filters";

export const useSearchAndFilters = <T>(
  elementsArray: T[],
  filterMethods: FilterMethod<T>[]
) => useFilters<T>(elementsArray, filterMethods);
