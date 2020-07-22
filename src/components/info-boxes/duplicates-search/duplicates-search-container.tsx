import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import { getFilesDuplicatesMap } from "util/duplicates/duplicates-util";
import DuplicatesSearch from "./duplicates-search";
import _ from "lodash";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";

const DuplicatesSearchContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const hashesMap = useSelector(getHashesFromStore);
  const duplicatesList = useMemo(() => {
    const filesDuplicatesMap = getFilesDuplicatesMap(
      filesAndFoldersMap,
      hashesMap
    );
    return _(filesDuplicatesMap)
      .pickBy((filesAndFoldersArray) => filesAndFoldersArray.length > 1)
      .values()
      .value() as FilesAndFolders[][];
  }, [filesAndFoldersMap, hashesMap]);

  return <DuplicatesSearch duplicatesList={duplicatesList} />;
};

export default DuplicatesSearchContainer;
