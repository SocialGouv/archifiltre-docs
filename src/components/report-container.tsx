import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../reducers/store";
import {
  getAllTagIdsForFile,
  getTagsByIds
} from "../reducers/tags/tags-selectors";
import ReportApiToProps from "./report";

const ReportContainer: FunctionComponent = ({ api, fillColor }: any) => {
  /* <Legacy> : to replace */
  const sequence = api.icicle_state.sequence();
  const nodeId = sequence[sequence.length - 1];
  /* </Legacy> */
  const tagIdsForCurrentFile = useSelector((state: StoreState) =>
    getAllTagIdsForFile(state.tags.tags, nodeId)
  );

  const tagsForCurrentFile = useSelector((state: StoreState) =>
    getTagsByIds(state.tags.tags, tagIdsForCurrentFile)
  );

  return (
    <ReportApiToProps
      tagsForCurrentFile={tagsForCurrentFile}
      api={api}
      fillColor={fillColor}
    />
  );
};

export default ReportContainer;
