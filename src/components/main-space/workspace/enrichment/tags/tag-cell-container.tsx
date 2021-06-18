import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTagIdsForFile,
  getTagsByIds,
  getTagsFromStore,
} from "reducers/tags/tags-selectors";
import TagCell from "./tag-cell";
import {
  getHoveredElementIdFromStore,
  getLockedElementIdFromStore,
} from "reducers/workspace-metadata/workspace-metadata-selectors";
import {
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
  isFolder,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { StoreState } from "reducers/store";
import { addTag, untagFile } from "reducers/tags/tags-actions";
import { commitAction } from "reducers/enhancers/undoable/undoable-actions";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { getAllChildren } from "util/files-and-folders/file-and-folders-utils";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import {
  markAsToDelete,
  unmarkAsToDelete,
} from "reducers/files-and-folders/files-and-folders-actions";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";

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

const TagCellContainer: FC = () => {
  const dispatch = useDispatch();

  const filesAndFoldersMap = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadataMap = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const allTags = useSelector(getTagsFromStore);

  const hoveredElementId = useSelector(getHoveredElementIdFromStore);
  const lockedElementId = useSelector(getLockedElementIdFromStore);

  const filesAndFoldersId = lockedElementId || hoveredElementId;

  const isFocused = filesAndFoldersId !== "";
  const isLocked = lockedElementId !== "";
  const isActive = isFocused || isLocked;

  const filesToDelete = useSelector(getElementsToDeleteFromStore);
  const isCurrentFileMarkedToDelete = filesToDelete.includes(filesAndFoldersId);

  const nodeId = isActive ? filesAndFoldersId : "";

  const tagIdsForCurrentFile = useSelector((state: StoreState) =>
    getAllTagIdsForFile(getTagsFromStore(state), filesAndFoldersId)
  );

  const tagsForCurrentFile = useSelector((state: StoreState) =>
    getTagsByIds(getTagsFromStore(state), tagIdsForCurrentFile)
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
  }, [
    dispatch,
    isCurrentFileMarkedToDelete,
    filesAndFoldersId,
    filesAndFoldersMetadataMap,
    filesAndFoldersMap,
  ]);

  const availableTags = useMemo(
    () =>
      Object.values(allTags).filter(
        (allTag) =>
          !tagsForCurrentFile.some(
            (tagForCurrentFile) => allTag.name === tagForCurrentFile.name
          )
      ),
    [tagsForCurrentFile, allTags]
  );

  return (
    <TagCell
      isActive={isActive}
      isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
      nodeId={nodeId}
      tagsForCurrentFile={tagsForCurrentFile}
      createTag={createTag}
      untag={untag}
      toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
      availableTags={availableTags}
    />
  );
};

export default TagCellContainer;
