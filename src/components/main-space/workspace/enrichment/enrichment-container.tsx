import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsToDelete,
  unmarkAsToDelete,
} from "reducers/files-and-folders/files-and-folders-actions";
import {
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
  isFolder,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { updateCommentThunk } from "reducers/files-and-folders/files-and-folders-thunks";
import { StoreState } from "reducers/store";
import { addTag, untagFile } from "reducers/tags/tags-actions";
import {
  getAllTagIdsForFile,
  getTagsByIds,
  getTagsFromStore,
} from "reducers/tags/tags-selectors";
import { useWorkspaceMetadata } from "reducers/workspace-metadata/workspace-metadata-selectors";
import Enrichment from "./enrichment";
import { commitAction } from "reducers/enhancers/undoable/undoable-actions";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getAllChildren } from "../../../../util/files-and-folders/file-and-folders-utils";

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
  isCurrentFileMarkedToDelete: boolean,
  filesAndFoldersMetadataMap: FilesAndFoldersMetadataMap,
  filesAndFoldersMap: FilesAndFoldersMap,
  filesAndFoldersId: string
): void => {
  if (!isCurrentFileMarkedToDelete) {
    const volumeToDelete = computeTreeSize(
      filesAndFoldersMetadataMap,
      filesAndFoldersMap,
      filesAndFoldersId
    );
    const elementsToDelete = getAllChildren(
      filesAndFoldersMap,
      filesAndFoldersId
    );

    addTracker({
      title: ActionTitle.ELEMENT_MARKED_TO_DELETE,
      type: ActionType.TRACK_EVENT,
      value: `Volume to delete: ${volumeToDelete}o; Elements to delete: ${elementsToDelete.length}`,
    });
  }
};

const EnrichmentContainer: FC = () => {
  const dispatch = useDispatch();
  const { hoveredElementId, lockedElementId } = useWorkspaceMetadata();

  const filesAndFoldersId = lockedElementId || hoveredElementId;

  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const createTag = useCallback(
    (tagName, ffId) => {
      dispatch(addTag(tagName, ffId));
      dispatch(commitAction());
    },
    [dispatch]
  );

  const untag = useCallback(
    (tagName, ffId) => {
      dispatch(untagFile(tagName, ffId));
      dispatch(commitAction());
    },
    [dispatch]
  );

  const updateComment = useCallback(
    (comments) => {
      dispatch(updateCommentThunk(filesAndFoldersId, comments));
      dispatch(commitAction());
    },
    [dispatch, filesAndFoldersId]
  );

  const currentFileComment =
    useSelector(getCommentsFromStore)[filesAndFoldersId] || "";

  const tagIdsForCurrentFile = useSelector((state: StoreState) =>
    getAllTagIdsForFile(getTagsFromStore(state), filesAndFoldersId)
  );

  const tagsForCurrentFile = useSelector((state: StoreState) =>
    getTagsByIds(getTagsFromStore(state), tagIdsForCurrentFile)
  );

  const filesToDelete = useSelector(getElementsToDeleteFromStore);
  const isCurrentFileMarkedToDelete = filesToDelete.includes(filesAndFoldersId);

  const toggleCurrentFileDeleteState = useCallback(() => {
    handleTracking(
      isCurrentFileMarkedToDelete,
      filesAndFoldersMetadataMap,
      filesAndFoldersMap,
      filesAndFoldersId
    );
    isCurrentFileMarkedToDelete
      ? dispatch(unmarkAsToDelete(filesAndFoldersId))
      : dispatch(markAsToDelete(filesAndFoldersId));
  }, [dispatch, isCurrentFileMarkedToDelete, filesAndFoldersId]);

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

export default EnrichmentContainer;
