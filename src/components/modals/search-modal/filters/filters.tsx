import Grid from "@material-ui/core/Grid";
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
    <>
      <Grid item xs={2}>
        <TypeFilter
          filesAndFolders={filesAndFolders}
          setFilters={setTypeFilters}
        />
      </Grid>
      <Grid item xs={2}>
        <SizeFilter setFilters={setSizeFilters} />
      </Grid>
      <Grid item xs={2}>
        <TagFilter
          filesAndFolders={filesAndFolders}
          tags={tags}
          setFilters={setTagFilters}
        />
      </Grid>
    </>
  );
};

export default Filters;
