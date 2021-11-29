import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import type { FilterMethod } from "typings/filter-types";

import Filter from "./filter";

interface SizeFilterProps {
    setFilters: (filters: FilterMethod<FilesAndFolders>[]) => void;
}

const kBToB = 1000;
const MBToB = 1000 * 1000;
const GBToB = 1000 * 1000 * 1000;

const availableOptions = [
    { label: "< 1ko", method: ({ file_size }) => file_size < kBToB },
    {
        label: ">= 1ko < 1Mo",
        method: ({ file_size }) => file_size >= kBToB && file_size < MBToB,
    },
    {
        label: ">= 1 Mo < 1Go",
        method: ({ file_size }) => file_size >= MBToB && file_size < GBToB,
    },
    { label: " >= 1Go", method: ({ file_size }) => file_size >= GBToB },
];

const makeSizeFilter = (
    selectedOption: string
): FilterMethod<FilesAndFolders> => {
    const option =
        availableOptions.find(({ label }) => label === selectedOption) ||
        availableOptions[0];
    return option.method;
};

const SizeFilter: React.FC<SizeFilterProps> = ({ setFilters }) => {
    const { t } = useTranslation();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    useEffect(() => {
        const selectedFilters = selectedOptions.map(makeSizeFilter);
        setFilters(selectedFilters);
    }, [setFilters, selectedOptions]);

    return (
        <Filter
            name={t("search.size")}
            availableOptions={availableOptions.map(({ label }) => label)}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
        />
    );
};

export default SizeFilter;
