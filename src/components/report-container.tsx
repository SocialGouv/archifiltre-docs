import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../reducers/store";
import { addTag, untagFile } from "../reducers/tags/tags-actions";
import {
  getAllTagIdsForFile,
  getTagsByIds,
  getTagsFromStore
} from "../reducers/tags/tags-selectors";
import ReportApiToProps from "./report";

interface ReportContainerProps {
  api: any;
  fillColor: (ffId: string) => string;
}

const ReportContainer: FC<ReportContainerProps> = ({ api, fillColor }) => {
  /* <Legacy> : to replace */
  const sequence = api.icicle_state.sequence();
  const nodeId = sequence[sequence.length - 1];
  /* </Legacy> */
  const tagIdsForCurrentFile = useSelector((state: StoreState) =>
    getAllTagIdsForFile(getTagsFromStore(state), nodeId)
  );

  const tagsForCurrentFile = useSelector((state: StoreState) =>
    getTagsByIds(getTagsFromStore(state), tagIdsForCurrentFile)
  );

  const dispatch = useDispatch();

  const createTag = useCallback(
    (tagName, ffId) => dispatch(addTag(tagName, ffId)),
    [dispatch]
  );
  const untag = useCallback(
    (tagName, ffId) => dispatch(untagFile(tagName, ffId)),
    [dispatch]
  );

  return (
    <ReportApiToProps
      tagsForCurrentFile={tagsForCurrentFile}
      api={api}
      fillColor={fillColor}
      createTag={createTag}
      untag={untag}
    />
  );
};

export default ReportContainer;
