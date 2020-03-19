import { useMemo } from "react";

export const useSearch = (filesAndFoldersArray, searchTerm) =>
  useMemo(
    () => filesAndFoldersArray.filter(({ name }) => name.includes(searchTerm)),
    [filesAndFoldersArray, searchTerm]
  );
