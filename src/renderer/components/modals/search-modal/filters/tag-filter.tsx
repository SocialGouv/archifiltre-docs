import type { FilterMethod } from "@common/utils/types";
import type { TFunction } from "i18next";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  ElementWithToDelete,
  FilesAndFolders,
} from "../../../../reducers/files-and-folders/files-and-folders-types";
import type { TagMap } from "../../../../reducers/tags/tags-types";
import { Filter } from "./filter";

export interface TagFilterProps {
  tags: TagMap;
  setFilters: (filters: FilterMethod<FilesAndFolders>[]) => void;
  toDelete: string[];
}

const computeAvailableOptions = (
  tags: TagMap,
  toDelete: string[],
  t: TFunction
): string[] => {
  const availableOptions = Object.values(tags).map(({ name }) => name);
  const availableOptionsWithToDelete = [
    ...availableOptions,
    t("common.toDelete"),
  ];
  return toDelete.length ? availableOptionsWithToDelete : availableOptions;
};

const makeTagFilter = (
  tags: TagMap,
  selectedOption: string
): FilterMethod<FilesAndFolders> => {
  const option =
    Object.values(tags).find(({ name }) => name === selectedOption) ??
    Object.values(tags)[0];

  return (filesAndFolders: FilesAndFolders) =>
    option.ffIds.includes(filesAndFolders.id);
};

const toDeleteFilter: FilterMethod<FilesAndFolders> = (
  filesAndFolders
): boolean => {
  return (filesAndFolders as ElementWithToDelete).toDelete;
};

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  toDelete,
  setFilters,
}) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    const selectedFilters = selectedOptions
      .filter((selectedOption) => selectedOption !== t("common.toDelete"))
      .map((selectedOption) => makeTagFilter(tags, selectedOption));
    const toDeleteFilters = selectedOptions.includes(t("common.toDelete"))
      ? [toDeleteFilter]
      : [];

    setFilters([...selectedFilters, ...toDeleteFilters]);
  }, [tags, setFilters, selectedOptions, t]);

  return (
    <Filter
      name={t("search.tag")}
      availableOptions={computeAvailableOptions(tags, toDelete, t)}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
    />
  );
};
