import _ from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import { BooleanOperator, joinFilters } from "util/array/array-util";
import Filter from "./filter";
import { FilterMethod } from "typings/filter-types";
import { useDeferredMemo } from "../../../../hooks/use-deferred-memo";

interface TypeFilterProps {
  filesAndFolders: FilesAndFolders[];
  setFilters: (filters: FilterMethod<FilesAndFolders>[]) => void;
}

const TypeFilter: FC<TypeFilterProps> = ({ filesAndFolders, setFilters }) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const availableOptions = useDeferredMemo(
    () =>
      _(filesAndFolders)
        .map((fileOrFolder) => getType(fileOrFolder))
        .uniq()
        .value(),
    [filesAndFolders]
  );

  useEffect(() => {
    const selectedFilters = selectedOptions.map(
      (selectedOption) => (fileOrFolder) =>
        getType(fileOrFolder) === selectedOption
    );
    const joinedFilters = joinFilters(selectedFilters, BooleanOperator.OR);
    setFilters([joinedFilters]);
  }, [setFilters, selectedOptions]);

  return (
    <Filter
      name={t("search.type")}
      availableOptions={availableOptions || []}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
    />
  );
};

export default TypeFilter;
