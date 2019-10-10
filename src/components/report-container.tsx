import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersFromStore } from "../reducers/files-and-folders/files-and-folders-selectors";
import { StoreState } from "../reducers/store";
import { addTag, untagFile } from "../reducers/tags/tags-actions";
import {
  getAllTagIdsForFile,
  getTagsByIds,
  getTagsFromStore
} from "../reducers/tags/tags-selectors";
import ReportApiToProps from "./report";
import { getFilesAndFoldersMetadataFromStore } from "../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";

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
      const updater = () => comments;
      api.database.updateComments(updater, filesAndFoldersId);
      api.undo.commit();
    },
    [api.database, api.undo, filesAndFoldersId]
  );

  return (
    <ReportApiToProps
      tagsForCurrentFile={tagsForCurrentFile}
      filesAndFolders={filesAndFolders}
      filesAndFoldersId={filesAndFoldersId}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      updateComment={updateComment}
      api={api}
      fillColor={fillColor}
      createTag={createTag}
      untag={untag}
    />
  );
};

export default ReportContainer;
