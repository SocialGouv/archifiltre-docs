import React, { FC } from "react";
import { useSelector } from "react-redux";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";
import AllTags from "./all-tags";

interface AllTagsContainerProps {
  api: any;
}

const AllTagsContainer: FC<AllTagsContainerProps> = ({ api }) => {
  const tags = useSelector(getTagsFromStore);
  return <AllTags api={api} tags={tags} />;
};

export default AllTagsContainer;
