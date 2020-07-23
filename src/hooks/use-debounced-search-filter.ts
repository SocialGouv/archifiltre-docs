import { useDebouncedValue } from "hooks/use-debounced-value";
import { useMemo } from "react";
import { makeFilterByProp } from "components/common/table/table-filters";

const DEBOUNCE_TIME = 300;

export const useDebouncedSearchFilter = <T extends object>(
  searchProp: keyof T,
  searchTerm: string,
  debounceTime = DEBOUNCE_TIME
) => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, debounceTime);

  return useMemo(() => makeFilterByProp<T>(searchProp, debouncedSearchTerm), [
    debouncedSearchTerm,
    searchProp,
  ]);
};
