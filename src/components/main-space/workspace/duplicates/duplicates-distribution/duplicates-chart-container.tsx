import type { FC } from "react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
    getFiles,
    getFilesAndFoldersFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";
import {
    countDuplicateFiles,
    countDuplicateFilesTotalSize,
} from "util/duplicates/duplicates-util";

import DuplicatesChart from "./duplicates-chart";

const DuplicatesChartContainer: FC = () => {
    const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
    const hashes = useSelector(getHashesFromStore);
    const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
    const rootFilesAndFoldersMetadata = metadata[""] || {};

    const duplicatesNumber = useMemo(
        () => countDuplicateFiles(filesAndFoldersMap, hashes),
        [filesAndFoldersMap, hashes]
    );
    const nonDuplicatesNumber = useMemo(
        () => getFiles(filesAndFoldersMap).length - duplicatesNumber,
        [filesAndFoldersMap, duplicatesNumber]
    );
    const duplicatesSize = useMemo(
        () => countDuplicateFilesTotalSize(filesAndFoldersMap, hashes),
        [filesAndFoldersMap, hashes]
    );
    const nonDuplicatesSize = useMemo(
        () => rootFilesAndFoldersMetadata.childrenTotalSize - duplicatesSize,
        [rootFilesAndFoldersMetadata, duplicatesSize]
    );

    return (
        <DuplicatesChart
            duplicatesNumber={duplicatesNumber}
            nonDuplicatesNumber={nonDuplicatesNumber}
            duplicatesSize={duplicatesSize}
            nonDuplicatesSize={nonDuplicatesSize}
        />
    );
};

export default DuplicatesChartContainer;
