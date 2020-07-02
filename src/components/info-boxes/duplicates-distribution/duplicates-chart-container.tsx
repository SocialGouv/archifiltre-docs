import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  countDuplicateFiles,
  countDuplicateFilesTotalSize,
} from "util/duplicates/duplicates-util";
import DuplicatesChart from "./duplicates-chart";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";

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
    () => Object.values(filesAndFoldersMap).length - duplicatesNumber,
    [filesAndFoldersMap, duplicatesNumber]
  );
  const duplicatesSize = useMemo(
    () => countDuplicateFilesTotalSize(filesAndFoldersMap, hashes),
    [filesAndFoldersMap, hashes]
  );
  const nonDuplictesSize = useMemo(
    () => rootFilesAndFoldersMetadata.childrenTotalSize - duplicatesSize,
    [rootFilesAndFoldersMetadata, duplicatesSize]
  );

  return (
    <DuplicatesChart
      duplicatesNumber={duplicatesNumber}
      nonDuplicatesNumber={nonDuplicatesNumber}
      duplicatesSize={duplicatesSize}
      nonDuplictesSize={nonDuplictesSize}
    />
  );
};

export default DuplicatesChartContainer;
