import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTag,
  renameTag,
  tagFile,
  untagFile,
} from "../../reducers/tags/tags-actions";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import { useWorkspaceMetadata } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import AllTags from "./all-tags";

interface AllTagsContainerProps {
  api: any;
}

const AllTagsContainer: FC<AllTagsContainerProps> = ({ api }) => {
  const tags = useSelector(getTagsFromStore);

  const dispatch = useDispatch();

  const { lockedElementId, hoveredElementId } = useWorkspaceMetadata();

  const renameTagCallback = useCallback(
    (tagId, newName) => dispatch(renameTag(tagId, newName)),
    [dispatch]
  );

  const deleteTagCallback = useCallback((tagId) => dispatch(deleteTag(tagId)), [
    dispatch,
  ]);

  const deleteTaggedCallback = useCallback(
    (tagId, ffId) => dispatch(untagFile(tagId, ffId)),
    [dispatch]
  );

  const addTaggedCallback = useCallback(
    (tagId, ffId) => dispatch(tagFile(tagId, ffId)),
    [dispatch]
  );

  const focusedNodeId = lockedElementId || hoveredElementId;

  return (
    <AllTags
      api={api}
      tags={tags}
      focusedNodeId={focusedNodeId}
      renameTag={renameTagCallback}
      deleteTag={deleteTagCallback}
      deleteTagged={deleteTaggedCallback}
      addTagged={addTaggedCallback}
    />
  );
};

export default AllTagsContainer;
