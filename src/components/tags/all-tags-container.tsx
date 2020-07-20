import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTag, renameTag } from "reducers/tags/tags-actions";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import AllTags from "./all-tags";

const AllTagsContainer: FC = () => {
  const tags = useSelector(getTagsFromStore);

  const dispatch = useDispatch();

  const renameTagCallback = useCallback(
    (tagId, newName) => dispatch(renameTag(tagId, newName)),
    [dispatch]
  );

  const deleteTagCallback = useCallback((tagId) => dispatch(deleteTag(tagId)), [
    dispatch,
  ]);

  return (
    <AllTags
      tags={tags}
      renameTag={renameTagCallback}
      deleteTag={deleteTagCallback}
    />
  );
};

export default AllTagsContainer;
