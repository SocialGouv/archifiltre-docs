import { useMemo } from "react";

import { type Filter, makeFilterByProp } from "../components/common/table/table-filters";
import { useDebouncedValue } from "./use-debounced-value";

const DEBOUNCE_TIME = 300;

export const useDebouncedSearchFilter = <T>(
  searchProp: keyof T,
  searchTerm: string,
  debounceTime = DEBOUNCE_TIME,
): Filter<T> => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, debounceTime);

  return useMemo(() => makeFilterByProp<T>(searchProp, debouncedSearchTerm), [debouncedSearchTerm, searchProp]);
};
