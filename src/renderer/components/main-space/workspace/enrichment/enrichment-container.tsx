import { getTrackerProvider } from "@common/modules/tracker";
import { bytesToMegabytes } from "@common/utils/numbers";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { commitAction } from "../../../../reducers/enhancers/undoable/undoable-actions";
import { markAsToDelete, unmarkAsToDelete } from "../../../../reducers/files-and-folders/files-and-folders-actions";
import {
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "../../../../reducers/files-and-folders/files-and-folders-selectors";
import { updateCommentThunk } from "../../../../reducers/files-and-folders/files-and-folders-thunks";
import { type FilesAndFoldersMap } from "../../../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { type FilesAndFoldersMetadataMap } from "../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { type StoreState } from "../../../../reducers/store";
import { addTag, untagFile } from "../../../../reducers/tags/tags-actions";
import { getAllTagIdsForFile, getTagsByIds, getTagsFromStore } from "../../../../reducers/tags/tags-selectors";
import { useWorkspaceMetadata } from "../../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { isFolder } from "../../../../utils";
import { getAllChildren } from "../../../../utils/file-and-folders";
import { Enrichment } from "./enrichment";

const computeTreeSize = (
  filesAndFoldersMetadataMap: FilesAndFoldersMetadataMap,
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string,
) => {
  const filesAndFolders = filesAndFoldersMap[filesAndFoldersId];
  return isFolder(filesAndFolders)
    ? filesAndFoldersMetadataMap[filesAndFoldersId].childrenTotalSize
    : filesAndFolders.file_size;
};

const handleTracking = (
  isCurrentFileMarkedToDelete: boolean,
  filesAndFoldersMetadataMap: FilesAndFoldersMetadataMap,
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string,
): void => {
  if (!isCurrentFileMarkedToDelete) {
    const sizeRaw = computeTreeSize(filesAndFoldersMetadataMap, filesAndFoldersMap, filesAndFoldersId);
    const fileCount = getAllChildren(filesAndFoldersMap, filesAndFoldersId).length;

    getTrackerProvider().track("Feat(4.0) Element Marked To Delete", {
      fileCount,
      mode: "enrichment",
      size: bytesToMegabytes(sizeRaw),
      sizeRaw,
    });
  }
};

export const EnrichmentContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { hoveredElementId, lockedElementId } = useWorkspaceMetadata();

  const filesAndFoldersId = lockedElementId || hoveredElementId;

  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(getFilesAndFoldersMetadataFromStore);

  const createTag = useCallback(
    (tagName: string, ffId: string) => {
      dispatch(addTag(tagName, ffId));
      dispatch(commitAction());
    },
    [dispatch],
  );

  const untag = useCallback(
    (tagName: string, ffId: string) => {
      dispatch(untagFile(tagName, ffId));
      dispatch(commitAction());
    },
    [dispatch],
  );

  const updateComment = useCallback(
    (comments: string) => {
      dispatch(updateCommentThunk(filesAndFoldersId, comments));
      dispatch(commitAction());
    },
    [dispatch, filesAndFoldersId],
  );

  const currentFileComment = useSelector(getCommentsFromStore)[filesAndFoldersId] || "";

  const tagIdsForCurrentFile = useSelector((state: StoreState) =>
    getAllTagIdsForFile(getTagsFromStore(state), filesAndFoldersId),
  );

  const tagsForCurrentFile = useSelector((state: StoreState) =>
    getTagsByIds(getTagsFromStore(state), tagIdsForCurrentFile),
  );

  const filesToDelete = useSelector(getElementsToDeleteFromStore);
  const isCurrentFileMarkedToDelete = filesToDelete.includes(filesAndFoldersId);

  const toggleCurrentFileDeleteState = useCallback(() => {
    handleTracking(isCurrentFileMarkedToDelete, filesAndFoldersMetadataMap, filesAndFoldersMap, filesAndFoldersId);
    if (isCurrentFileMarkedToDelete) dispatch(unmarkAsToDelete(filesAndFoldersId));
    else dispatch(markAsToDelete(filesAndFoldersId));
  }, [dispatch, isCurrentFileMarkedToDelete, filesAndFoldersId, filesAndFoldersMap, filesAndFoldersMetadataMap]);

  const isFocused = filesAndFoldersId !== "";
  const isLocked = lockedElementId !== "";
  const isActive = isFocused || isLocked;

  const nodeId = isActive ? filesAndFoldersId : "";

  return (
    <Enrichment
      createTag={createTag}
      untag={untag}
      updateComment={updateComment}
      currentFileComment={currentFileComment}
      tagsForCurrentFile={tagsForCurrentFile}
      isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
      toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
      nodeId={nodeId}
      isActive={isActive}
    />
  );
};
