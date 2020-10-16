import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getFilesDuplicatesMap } from "util/duplicates/duplicates-util";
import DuplicatesSearch from "./duplicates-search";
import _ from "lodash";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import {
  markElementsToDelete,
  unmarkElementsToDelete,
} from "reducers/files-and-folders/files-and-folders-actions";

const DuplicatesSearchContainer: FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const hashesMap = useSelector(getHashesFromStore);
  const dispatch = useDispatch();

  const elementsToDelete = useSelector(getElementsToDeleteFromStore);

  const tagAsToDelete = useCallback(
    (ids: string[]) => {
      dispatch(markElementsToDelete(ids));
    },
    [dispatch]
  );

  const untagAsToDelete = useCallback(
    (ids: string[]) => {
      dispatch(unmarkElementsToDelete(ids));
    },
    [dispatch]
  );

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

  return (
    <DuplicatesSearch
      duplicatesList={duplicatesList}
      elementsToDelete={elementsToDelete}
      tagAsToDelete={tagAsToDelete}
      untagAsToDelete={untagAsToDelete}
    />
  );
};

export default DuplicatesSearchContainer;
