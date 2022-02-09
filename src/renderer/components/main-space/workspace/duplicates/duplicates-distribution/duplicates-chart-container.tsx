import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  getFiles,
  getFilesAndFoldersFromStore,
} from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "../../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getHashesFromStore } from "../../../../../reducers/hashes/hashes-selectors";
import {
  countDuplicateFiles,
  countDuplicateFilesTotalSize,
} from "../../../../../utils/duplicates/duplicates-util";
import type { DuplicatesChartProps } from "./duplicates-chart";
import { DuplicatesChart } from "./duplicates-chart";

export const DuplicatesChartContainer: React.FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const hashes = useSelector(getHashesFromStore);
  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);

  const duplicatesNumber: DuplicatesChartProps["duplicatesNumber"] = useMemo(
    () => countDuplicateFiles(filesAndFoldersMap, hashes),
    [filesAndFoldersMap, hashes]
  );
  const nonDuplicatesNumber: DuplicatesChartProps["nonDuplicatesNumber"] =
    useMemo(
      () => getFiles(filesAndFoldersMap).length - duplicatesNumber,
      [filesAndFoldersMap, duplicatesNumber]
    );
  const duplicatesSize: DuplicatesChartProps["duplicatesSize"] = useMemo(
    () => countDuplicateFilesTotalSize(filesAndFoldersMap, hashes),
    [filesAndFoldersMap, hashes]
  );
  const nonDuplicatesSize: DuplicatesChartProps["nonDuplicatesSize"] =
    useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const rootFilesAndFoldersMetadata = metadata[""] ?? {};
      return rootFilesAndFoldersMetadata.childrenTotalSize - duplicatesSize;
    }, [metadata, duplicatesSize]);

  return (
    <DuplicatesChart
      duplicatesNumber={duplicatesNumber}
      nonDuplicatesNumber={nonDuplicatesNumber}
      duplicatesSize={duplicatesSize}
      nonDuplicatesSize={nonDuplicatesSize}
    />
  );
};
