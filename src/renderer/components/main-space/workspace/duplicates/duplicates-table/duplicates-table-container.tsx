import { getPercentage } from "@common/utils/numbers";
import _ from "lodash";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { getFilesAndFoldersFromStore } from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "../../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getHashesFromStore } from "../../../../../reducers/hashes/hashes-selectors";
import {
  countDuplicateFileSizes,
  countDuplicateFileTypes,
  getFilesDuplicatesMap,
} from "../../../../../utils/duplicates";
import { DuplicatesTable, type DuplicatesTableProps } from "./duplicates-table";

const removeZeroValues = <TKey extends number | string, TValue>(obj: {
  [key in TKey]: TValue;
}): _.Dictionary<TValue> => _.pickBy<TValue>(obj);

export const DuplicatesTableContainer: React.FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(getFilesAndFoldersMetadataFromStore);
  const hashesMap = useSelector(getHashesFromStore);

  const duplicatesMap = useMemo(
    () => getFilesDuplicatesMap(filesAndFoldersMap, hashesMap),
    [filesAndFoldersMap, hashesMap],
  );

  const fileTypesCount = useMemo(
    () => removeZeroValues(countDuplicateFileTypes(duplicatesMap)) as DuplicatesTableProps["fileTypesCount"],
    [duplicatesMap],
  );

  const fileSizesCount = useMemo(() => removeZeroValues(countDuplicateFileSizes(duplicatesMap)), [duplicatesMap]);

  const filePercentagesCount = useMemo(
    () =>
      removeZeroValues(
        _.mapValues(fileSizesCount, fileSize =>
          getPercentage(fileSize || 0, filesAndFoldersMetadataMap[""].childrenTotalSize, 2),
        ),
      ),
    [fileSizesCount, filesAndFoldersMetadataMap],
  );

  return (
    <DuplicatesTable
      fileTypesCount={fileTypesCount}
      fileSizesCount={fileSizesCount}
      filePercentagesCount={filePercentagesCount}
    />
  );
};
