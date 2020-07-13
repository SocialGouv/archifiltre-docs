import { Box } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import { FilterMethod } from "typings/filter-types";
import SizeFilter from "./size-filter";
import TagFilter from "./tag-filter";
import TypeFilter from "./type-filter";

interface FiltersProps {
  filesAndFolders: FilesAndFolders[];
  tags: TagMap;
  setFilters: (filters: FilterMethod<FilesAndFolders>[]) => void;
}

const Filters: FC<FiltersProps> = ({ filesAndFolders, tags, setFilters }) => {
  const [typeFilters, setTypeFilters] = useState<
    FilterMethod<FilesAndFolders>[]
  >([]);
  const [sizeFilters, setSizeFilters] = useState<
    FilterMethod<FilesAndFolders>[]
  >([]);
  const [tagFilters, setTagFilters] = useState<FilterMethod<FilesAndFolders>[]>(
    []
  );

  useEffect(() => {
    setFilters([...typeFilters, ...sizeFilters, ...tagFilters]);
  }, [setFilters, typeFilters, sizeFilters, tagFilters]);

  return (
    <Box display="flex" paddingLeft={1} paddingBottom={1} paddingTop={1}>
      <Box flex={1} paddingRight={1}>
        <TypeFilter
          filesAndFolders={filesAndFolders}
          setFilters={setTypeFilters}
        />
      </Box>
      <Box flex={1} paddingRight={1}>
        <SizeFilter setFilters={setSizeFilters} />
      </Box>
      <Box flex={1}>
        <TagFilter
          filesAndFolders={filesAndFolders}
          tags={tags}
          setFilters={setTagFilters}
        />
      </Box>
    </Box>
  );
};

export default Filters;
