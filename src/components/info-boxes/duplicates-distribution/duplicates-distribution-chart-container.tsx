import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  countDuplicateFileSizes,
  countDuplicateFileTypes,
  getFilesDuplicatesMap,
} from "util/duplicates/duplicates-util";
import DuplicatesDistributionChart from "./duplicates-distribution-chart";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";

const DuplicatesDistributionChartContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const hashesMap = useSelector(getHashesFromStore);

  const duplicatesMap = useMemo(
    () => getFilesDuplicatesMap(filesAndFoldersMap, hashesMap),
    [filesAndFoldersMap, hashesMap]
  );

  const fileTypesCount = useMemo(() => countDuplicateFileTypes(duplicatesMap), [
    duplicatesMap,
  ]);

  const fileSizesCount = useMemo(() => countDuplicateFileSizes(duplicatesMap), [
    duplicatesMap,
  ]);

  return (
    <DuplicatesDistributionChart
      fileTypesCount={fileTypesCount}
      fileSizesCount={fileSizesCount}
    />
  );
};

export default DuplicatesDistributionChartContainer;
