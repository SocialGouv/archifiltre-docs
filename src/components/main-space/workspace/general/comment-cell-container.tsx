import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { commitAction } from "../../../../reducers/enhancers/undoable/undoable-actions";
import { getCommentsFromStore } from "../../../../reducers/files-and-folders/files-and-folders-selectors";
import { updateCommentThunk } from "../../../../reducers/files-and-folders/files-and-folders-thunks";
import {
  getHoveredElementIdFromStore,
  getLockedElementIdFromStore,
} from "../../../../reducers/workspace-metadata/workspace-metadata-selectors";
import type { CommentCellProps } from "./comment-cell";
import { CommentCell } from "./comment-cell";

export const CommentCellContainer: React.FC = () => {
  const dispatch = useDispatch();

  const hoveredElementId = useSelector(getHoveredElementIdFromStore);
  const lockedElementId = useSelector(getLockedElementIdFromStore);

  const filesAndFoldersId = lockedElementId || hoveredElementId;

  const isFocused = filesAndFoldersId !== "";
  const isLocked = lockedElementId !== "";
  const isActive = isFocused || isLocked;

  const currentFileComment =
    useSelector(getCommentsFromStore)[filesAndFoldersId] || "";

  const updateComment: CommentCellProps["updateComment"] = useCallback(
    (comments) => {
      dispatch(updateCommentThunk(filesAndFoldersId, comments));
      dispatch(commitAction());
    },
    [dispatch, filesAndFoldersId]
  );

  return (
    <CommentCell
      isActive={isActive}
      comment={currentFileComment}
      updateComment={updateComment}
    />
  );
};
