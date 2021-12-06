import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import {
    getFileCount,
    getFilesAndFoldersFromStore,
} from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import { FileCountInfo } from "./file-count-info";

export const FileCountInfoContainer: React.FC = () => {
    const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);

    const fileCount = useMemo(
        () => getFileCount(filesAndFoldersMap),
        [filesAndFoldersMap]
    );

    return <FileCountInfo fileCount={fileCount} />;
};
