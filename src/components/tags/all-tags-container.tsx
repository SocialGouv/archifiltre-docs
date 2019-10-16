import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTag,
  renameTag,
  tagFile,
  untagFile
} from "../../reducers/tags/tags-actions";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import AllTags from "./all-tags";

interface AllTagsContainerProps {
  api: any;
}

const AllTagsContainer: FC<AllTagsContainerProps> = ({ api }) => {
  const tags = useSelector(getTagsFromStore);

  const dispatch = useDispatch();

  const renameTagCallback = useCallback(
    (tagId, newName) => dispatch(renameTag(tagId, newName)),
    [dispatch]
  );

  const deleteTagCallback = useCallback(tagId => dispatch(deleteTag(tagId)), [
    dispatch
  ]);

  const deleteTaggedCallback = useCallback(
    (tagId, ffId) => dispatch(untagFile(tagId, ffId)),
    [dispatch]
  );

  const addTaggedCallback = useCallback(
    (tagId, ffId) => dispatch(tagFile(tagId, ffId)),
    [dispatch]
  );

  return (
    <AllTags
      api={api}
      tags={tags}
      renameTag={renameTagCallback}
      deleteTag={deleteTagCallback}
      deleteTagged={deleteTaggedCallback}
      addTagged={addTaggedCallback}
    />
  );
};

export default AllTagsContainer;
