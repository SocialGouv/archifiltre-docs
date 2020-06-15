import { FilterMethod } from "typings/filter-types";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { useFilters } from "./use-filters";
import { useSearch } from "./use-search";
import { useDebouncedValue } from "./use-debounced-value";

const DEBOUNCE_TIME = 300;

export const useSearchAndFilters = (
  filesAndFoldersArray: FilesAndFolders[],
  searchTerm: string,
  filterMethods: FilterMethod<FilesAndFolders>[]
) => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, DEBOUNCE_TIME);
  const filteredBySearchFilesAndFolders = useSearch(
    filesAndFoldersArray,
    debouncedSearchTerm
  );
  return useFilters<FilesAndFolders>(
    filteredBySearchFilesAndFolders,
    filterMethods
  );
};
