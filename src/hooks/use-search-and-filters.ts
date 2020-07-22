import { FilterMethod } from "typings/filter-types";
import { useFilters } from "./use-filters";
import { useSearch } from "./use-search";
import { useDebouncedValue } from "./use-debounced-value";

const DEBOUNCE_TIME = 300;

export const useSearchAndFilters = <T>(
  filesAndFoldersArray: T[],
  searchTerm: string,
  filterMethods: FilterMethod<T>[]
) => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, DEBOUNCE_TIME);
  const filteredBySearchFilesAndFolders = useSearch(
    filesAndFoldersArray,
    debouncedSearchTerm
  );
  return useFilters<T>(filteredBySearchFilesAndFolders, filterMethods);
};
