import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  getFilesAndFoldersFromStore,
  getHashesFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getFilesDuplicatesMap } from "util/duplicates/duplicates-util";
import DuplicatesSearch from "./duplicates-search";
import _ from "lodash";

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
      .flatten()
      .value();
  }, [filesAndFoldersMap, hashesMap]);

  return <DuplicatesSearch duplicatesList={duplicatesList} />;
};

export default DuplicatesSearchContainer;
