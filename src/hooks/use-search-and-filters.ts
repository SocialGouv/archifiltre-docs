import { FilterMethod } from "typings/filter-types";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { useFilters } from "./use-filters";
import { useSearch } from "./use-search";

export const useSearchAndFilters = (
  filesAndFoldersArray: FilesAndFolders[],
  searchTerm: string,
  filterMethods: FilterMethod<FilesAndFolders>[]
) => {
  const filteredBySearchFilesAndFolders = useSearch(
    filesAndFoldersArray,
    searchTerm
  );
  return useFilters<FilesAndFolders>(
    filteredBySearchFilesAndFolders,
    filterMethods
  );
};
