import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { TagMap } from "reducers/tags/tags-types";
import Filter from "./filter";
import { FilterMethod } from "typings/filter-types";

type TagFilterProps = {
  filesAndFolders: FilesAndFolders[];
  tags: TagMap;
  setFilters: (filters: FilterMethod<FilesAndFolders>[]) => void;
};

const makeTagFilter = (
  tags: TagMap,
  selectedOption: string
): FilterMethod<FilesAndFolders> => {
  const option =
    Object.values(tags).find(({ name }) => name === selectedOption) ||
    Object.values(tags)[0];
  return (filesAndFolders: FilesAndFolders) =>
    option.ffIds.includes(filesAndFolders.id);
};

const TagFilter: FC<TagFilterProps> = ({ tags, setFilters }) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    const selectedFilters = selectedOptions.map((selectedOption) =>
      makeTagFilter(tags, selectedOption)
    );
    setFilters(selectedFilters);
  }, [tags, setFilters, selectedOptions]);

  return (
    <Filter
      name={t("search.tag")}
      availableOptions={Object.values(tags).map(({ name }) => name)}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
    />
  );
};

export default TagFilter;
