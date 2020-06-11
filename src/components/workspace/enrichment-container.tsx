import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  markAsToDelete,
  unmarkAsToDelete,
} from "../../reducers/files-and-folders/files-and-folders-actions";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getFilesToDeleteFromStore,
  getHashesFromStore,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import {
  updateAliasThunk,
  updateCommentThunk,
} from "../../reducers/files-and-folders/files-and-folders-thunks";
import { StoreState } from "../../reducers/store";
import { addTag, untagFile } from "../../reducers/tags/tags-actions";
import {
  getAllTagIdsForFile,
  getTagsByIds,
  getTagsFromStore,
} from "../../reducers/tags/tags-selectors";
import { useWorkspaceMetadata } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import Enrichment from "./enrichment";

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
    (comments) => {
      dispatch(updateCommentThunk(filesAndFoldersId, comments));
      api.undo.commit();
    },
    [dispatch, api, filesAndFoldersId]
  );

  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

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

  const currentFilesAndFolders = isActive
    ? filesAndFolders[filesAndFoldersId]
    : null;

  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );

  const currentFileHash = useSelector((state: StoreState) =>
    getHashesFromStore(state)
  )[filesAndFoldersId];

  const currentFileAlias =
    useSelector(getAliasesFromStore)[filesAndFoldersId] || "";

  const onChangeAlias = useCallback(
    (alias) => {
      dispatch(updateAliasThunk(filesAndFoldersId, alias));
      api.undo.commit();
    },
    [dispatch, api, filesAndFoldersId]
  );

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
      filesAndFoldersId={filesAndFoldersId}
      isActive={isActive}
      api={api}
      currentFilesAndFolders={currentFilesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      currentFileAlias={currentFileAlias}
      currentFileHash={currentFileHash}
      onChangeAlias={onChangeAlias}
    />
  );
};

export default EnrichmentContainer;
