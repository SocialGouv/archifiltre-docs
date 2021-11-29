import {
    countFileSizes,
    countFileTypes,
} from "exporters/audit/audit-report-values-computer";
import type { FC } from "react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";

import FileTypesDetails from "./file-types-details";

const FileTypesDetailsContainer: FC = () => {
    const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

    const fileTypesCount = useMemo(
        () => countFileTypes(filesAndFolders),
        [filesAndFolders]
    );

    const fileSizesCount = useMemo(
        () => countFileSizes(filesAndFolders),
        [filesAndFolders]
    );

    return (
        <FileTypesDetails
            elementsCountsByType={fileTypesCount}
            elementsSizesByType={fileSizesCount}
        />
    );
};

export default FileTypesDetailsContainer;
