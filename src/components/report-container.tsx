import React, { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../reducers/store";
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

  return (
    <ReportApiToProps
      tagsForCurrentFile={tagsForCurrentFile}
      api={api}
      fillColor={fillColor}
    />
  );
};

export default ReportContainer;
