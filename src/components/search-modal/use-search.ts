import { useMemo } from "react";

export const useSearch = (filesAndFoldersArray, searchTerm) =>
  useMemo(() => {
    const sanitizedSearchTerm = searchTerm.trim().toLowerCase();
    return filesAndFoldersArray.filter(({ name }) =>
      name.toLowerCase().includes(sanitizedSearchTerm)
    );
  }, [filesAndFoldersArray, searchTerm]);
