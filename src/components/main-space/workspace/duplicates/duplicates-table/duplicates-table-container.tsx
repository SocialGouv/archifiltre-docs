import _ from "lodash";
import type { FC } from "react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";
import {
    countDuplicateFileSizes,
    countDuplicateFileTypes,
    getFilesDuplicatesMap,
} from "util/duplicates/duplicates-util";
import { percent } from "util/numbers/numbers-util";

import DuplicatesTable from "./duplicates-table";

const removeZeroValues = <Key extends number | string, Value>(obj: {
    [key in Key]: Value;
}): _.Dictionary<Value> => _.pickBy<Value>(obj);

const DuplicatesTableContainer: FC = () => {
    const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
    const filesAndFoldersMetadataMap = useSelector(
        getFilesAndFoldersMetadataFromStore
    );
    const hashesMap = useSelector(getHashesFromStore);

    const duplicatesMap = useMemo(
        () => getFilesDuplicatesMap(filesAndFoldersMap, hashesMap),
        [filesAndFoldersMap, hashesMap]
    );

    const fileTypesCount = useMemo(
        () => removeZeroValues(countDuplicateFileTypes(duplicatesMap)),
        [duplicatesMap]
    );

    const fileSizesCount = useMemo(
        () => removeZeroValues(countDuplicateFileSizes(duplicatesMap)),
        [duplicatesMap]
    );

    const filePercentagesCount = useMemo(
        () =>
            removeZeroValues(
                _.mapValues(fileSizesCount, (fileSize) =>
                    percent(
                        fileSize || 0,
                        filesAndFoldersMetadataMap[""].childrenTotalSize,
                        {
                            numbersOfDecimals: 2,
                        }
                    )
                )
            ),
        [fileSizesCount]
    );

    return (
        <DuplicatesTable
            fileTypesCount={fileTypesCount}
            fileSizesCount={fileSizesCount}
            filePercentagesCount={filePercentagesCount}
        />
    );
};

export default DuplicatesTableContainer;
