import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsToDelete,
  unmarkAsToDelete,
} from "../../reducers/files-and-folders/files-and-folders-actions";
import {
  getCommentsFromStore,
  getFilesToDeleteFromStore,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { updateCommentThunk } from "../../reducers/files-and-folders/files-and-folders-thunks";
import { StoreState } from "../../reducers/store";
import { addTag, untagFile } from "../../reducers/tags/tags-actions";
import {
  getAllTagIdsForFile,
  getTagsByIds,
  getTagsFromStore,
} from "../../reducers/tags/tags-selectors";
import { useWorkspaceMetadata } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import Enrichment from "./enrichment";
import { commitAction } from "../../reducers/enhancers/undoable/undoable-actions";

interface EnrichmentContainerProps {
  api: any;
}

const EnrichmentContainer: FC<EnrichmentContainerProps> = ({ api }) => {
  const dispatch = useDispatch();
  const { hoveredElementId, lockedElementId } = useWorkspaceMetadata();

  const filesAndFoldersId = lockedElementId || hoveredElementId;

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

  const filesToDelete = useSelector(getFilesToDeleteFromStore);
  const isCurrentFileMarkedToDelete = filesToDelete.includes(filesAndFoldersId);

  const toggleCurrentFileDeleteState = useCallback(() => {
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
      api={api}
    />
  );
};

export default EnrichmentContainer;
