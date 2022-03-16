import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { getFilesAndFoldersFromStore } from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import { getHashesFromStore } from "../../../../../reducers/hashes/hashes-selectors";
import {
  countDuplicateFileSizes,
  countDuplicateFileTypes,
  getFilesDuplicatesMap,
} from "../../../../../utils/duplicates";
import { DuplicatesDistributionChart } from "./duplicates-distribution-chart";

export const DuplicatesDistributionChartContainer: React.FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const hashesMap = useSelector(getHashesFromStore);

  const duplicatesMap = useMemo(
    () => getFilesDuplicatesMap(filesAndFoldersMap, hashesMap),
    [filesAndFoldersMap, hashesMap]
  );

  const fileTypesCount = useMemo(
    () => countDuplicateFileTypes(duplicatesMap),
    [duplicatesMap]
  );

  const fileSizesCount = useMemo(
    () => countDuplicateFileSizes(duplicatesMap),
    [duplicatesMap]
  );

  // TODO
  return (
    <DuplicatesDistributionChart
      fileTypesCount={fileTypesCount}
      fileSizesCount={fileSizesCount}
    />
  );
};
