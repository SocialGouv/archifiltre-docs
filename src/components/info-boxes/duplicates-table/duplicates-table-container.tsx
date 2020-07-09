import React, { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  countDuplicateFileSizes,
  countDuplicateFileTypes,
  getFilesDuplicatesMap,
} from "util/duplicates/duplicates-util";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { percent } from "util/numbers/numbers-util";
import DuplicatesTable from "./duplicates-table";
import _ from "lodash";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";

const DuplicatesTableContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const hashesMap = useSelector(getHashesFromStore);

  const removeZeroValues = useCallback(
    (object) => _.pickBy(object, (value, key) => value !== 0),
    []
  );

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
          percent(fileSize, filesAndFoldersMetadataMap[""].childrenTotalSize, {
            numbersOfDecimals: 2,
          })
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
