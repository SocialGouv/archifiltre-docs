import { Box } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import { FilterMethod } from "typings/filter-types";
import SizeFilter from "./size-filter";
import TagFilter from "./tag-filter";
import TypeFilter from "./type-filter";

type FiltersProps = {
  filesAndFolders: FilesAndFolders[];
  tags: TagMap;
  setFilters: (filters: FilterMethod<FilesAndFolders>[]) => void;
  toDelete: string[];
};

const Filters: FC<FiltersProps> = ({
  filesAndFolders,
  tags,
  toDelete,
  setFilters,
}) => {
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
        <TagFilter tags={tags} setFilters={setTagFilters} toDelete={toDelete} />
      </Box>
    </Box>
  );
};

export default Filters;
