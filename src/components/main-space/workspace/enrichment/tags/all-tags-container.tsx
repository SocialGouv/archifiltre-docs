import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    deleteTag,
    renameTag,
} from "../../../../../reducers/tags/tags-actions";
import { getTagsFromStore } from "../../../../../reducers/tags/tags-selectors";
import type { AllTagsApiToPropsProps } from "./all-tags";
import { AllTagsApiToProps as AllTags } from "./all-tags";

export const AllTagsContainer: React.FC = () => {
    const tags = useSelector(getTagsFromStore);

    const dispatch = useDispatch();

    const renameTagCallback: AllTagsApiToPropsProps["renameTag"] = useCallback(
        (tagId, newName) => dispatch(renameTag(tagId, newName)),
        [dispatch]
    );

    const deleteTagCallback: AllTagsApiToPropsProps["deleteTag"] = useCallback(
        (tagId) => dispatch(deleteTag(tagId)),
        [dispatch]
    );

    return (
        <AllTags
            tags={tags}
            renameTag={renameTagCallback}
            deleteTag={deleteTagCallback}
        />
    );
};
