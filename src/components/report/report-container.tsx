import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  markAsToDelete,
  unmarkAsToDelete
} from "../../reducers/files-and-folders/files-and-folders-actions";
import {
  getFilesAndFoldersFromStore,
  getFilesToDeleteFromStore,
  getHashesFromStore
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import {
  updateAliasThunk,
  updateCommentThunk
} from "../../reducers/files-and-folders/files-and-folders-thunks";
import { StoreState } from "../../reducers/store";
import { addTag, untagFile } from "../../reducers/tags/tags-actions";
import {
  getAllTagIdsForFile,
  getTagsByIds,
  getTagsFromStore
} from "../../reducers/tags/tags-selectors";
import { getWorkspaceMetadataFromStore } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import ReportApiToProps from "./report";

interface ReportContainerProps {
  api: any;
  fillColor: (ffId: string) => string;
}

const ReportContainer: FC<ReportContainerProps> = ({ api, fillColor }) => {
  /* <Legacy> : to replace */
  const sequence = api.icicle_state.sequence();
  const filesAndFoldersId = sequence[sequence.length - 1];
  /* </Legacy> */
  const tagIdsForCurrentFile = useSelector((state: StoreState) =>
    getAllTagIdsForFile(getTagsFromStore(state), filesAndFoldersId)
  );

  const tagsForCurrentFile = useSelector((state: StoreState) =>
    getTagsByIds(getTagsFromStore(state), tagIdsForCurrentFile)
  );

  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const currentFileHash = useSelector((state: StoreState) =>
    getHashesFromStore(state)
  )[filesAndFoldersId];
  const { originalPath } = useSelector(getWorkspaceMetadataFromStore);

  const filesToDelete = useSelector(getFilesToDeleteFromStore);
  const isCurrentFileMarkedToDelete = filesToDelete.includes(filesAndFoldersId);

  const dispatch = useDispatch();

  const createTag = useCallback(
    (tagName, ffId) => {
      dispatch(addTag(tagName, ffId));
      api.undo.commit();
    },
    [dispatch, api]
  );

  const untag = useCallback(
    (tagName, ffId) => {
      dispatch(untagFile(tagName, ffId));
      api.undo.commit();
    },
    [dispatch, api]
  );

  const updateComment = useCallback(
    comments => {
      dispatch(updateCommentThunk(filesAndFoldersId, comments));
      api.undo.commit();
    },
    [dispatch, api, filesAndFoldersId]
  );

  const updateAlias = useCallback(
    alias => {
      dispatch(updateAliasThunk(filesAndFoldersId, alias));
      api.undo.commit();
    },
    [dispatch, api, filesAndFoldersId]
  );

  const toggleCurrentFileDeleteState = useCallback(() => {
    isCurrentFileMarkedToDelete
      ? dispatch(unmarkAsToDelete(filesAndFoldersId))
      : dispatch(markAsToDelete(filesAndFoldersId));
  }, [dispatch, isCurrentFileMarkedToDelete, filesAndFoldersId]);

  return (
    <ReportApiToProps
      originalPath={originalPath}
      tagsForCurrentFile={tagsForCurrentFile}
      currentFileHash={currentFileHash}
      filesAndFolders={filesAndFolders}
      filesAndFoldersId={filesAndFoldersId}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
      updateAlias={updateAlias}
      updateComment={updateComment}
      toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
      api={api}
      fillColor={fillColor}
      createTag={createTag}
      untag={untag}
    />
  );
};

export default ReportContainer;
