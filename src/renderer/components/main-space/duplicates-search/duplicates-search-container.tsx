import { getTrackerProvider } from "@common/modules/tracker";
import { bytesToMegabytes } from "@common/utils/numbers";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  markElementsToDelete,
  unmarkElementsToDelete,
} from "../../../reducers/files-and-folders/files-and-folders-actions";
import {
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "../../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { FilesAndFoldersMetadataMap } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getHashesFromStore } from "../../../reducers/hashes/hashes-selectors";
import { isFolder } from "../../../utils";
import { getFilesDuplicatesMap } from "../../../utils/duplicates";
import { getAllChildren } from "../../../utils/file-and-folders";
import { DuplicatesSearch } from "./duplicates-search";

const computeTreeSize = (
  filesAndFoldersMetadataMap: FilesAndFoldersMetadataMap,
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
) => {
  const filesAndFolders = filesAndFoldersMap[filesAndFoldersId];
  return isFolder(filesAndFolders)
    ? filesAndFoldersMetadataMap[filesAndFoldersId].childrenTotalSize
    : filesAndFolders.file_size;
};

const handleTracking = (
  filesAndFoldersMetadataMap: FilesAndFoldersMetadataMap,
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersIds: string[]
): void => {
  const sizeRaw = filesAndFoldersIds.reduce(
    (acc, filesAndFoldersId) =>
      acc +
      computeTreeSize(
        filesAndFoldersMetadataMap,
        filesAndFoldersMap,
        filesAndFoldersId
      ),
    0
  );
  const fileCount = filesAndFoldersIds.reduce(
    (acc, filesAndFoldersId) =>
      acc + getAllChildren(filesAndFoldersMap, filesAndFoldersId).length,
    0
  );

  getTrackerProvider().track("Feat(4.0) Element Marked To Delete", {
    fileCount,
    mode: "duplicate",
    size: bytesToMegabytes(sizeRaw),
    sizeRaw,
  });
};

export const DuplicatesSearchContainer: React.FC = () => {
  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const hashesMap = useSelector(getHashesFromStore);
  const dispatch = useDispatch();

  const elementsToDelete = useSelector(getElementsToDeleteFromStore);

  const tagAsToDelete = useCallback(
    (ids: string[]) => {
      dispatch(markElementsToDelete(ids));
      handleTracking(filesAndFoldersMetadataMap, filesAndFoldersMap, ids);
    },
    [dispatch, filesAndFoldersMetadataMap, filesAndFoldersMap]
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
      .value();
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
