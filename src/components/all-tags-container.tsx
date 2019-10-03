import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../reducers/store";
import AllTags from "./all-tags";

const AllTagsContainer: FunctionComponent = ({ api }: any) => {
  const tags = useSelector((state: StoreState) => state.tags.tags);
  return <AllTags api={api} tags={tags} />;
};

export default AllTagsContainer;
