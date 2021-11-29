import { useDeferredMemo } from "hooks/use-deferred-memo";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import type { FilterMethod } from "typings/filter-types";
import { BooleanOperator, joinFilters } from "util/array/array-util";
import { getType } from "util/files-and-folders/file-and-folders-utils";

import Filter from "./filter";

interface TypeFilterProps {
    filesAndFolders: FilesAndFolders[];
    setFilters: (filters: FilterMethod<FilesAndFolders>[]) => void;
}

interface ComputeOptionsOptions {
    folderLabel: string;
    unknownLabel: string;
}

const computeOptions = (
    filesAndFolders: FilesAndFolders[],
    { folderLabel, unknownLabel }: ComputeOptionsOptions
): string[] =>
    _(filesAndFolders)
        .map((fileOrFolder) =>
            getType(fileOrFolder, { folderLabel, unknownLabel })
        )
        .uniq()
        .value();

const TypeFilter: React.FC<TypeFilterProps> = ({
    filesAndFolders,
    setFilters,
}) => {
    const { t } = useTranslation();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const availableOptions = useDeferredMemo(
        () =>
            computeOptions(filesAndFolders, {
                folderLabel: t("common.folder"),
                unknownLabel: t("common.unknown"),
            }),
        [filesAndFolders, t]
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
