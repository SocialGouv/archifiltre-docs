import Box from "@material-ui/core/Box";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { commitAction } from "../../../../../reducers/enhancers/undoable/undoable-actions";
import {
    getElementsToDeleteFromStore,
    getFilesAndFoldersFromStore,
    getFilesTotalSize,
} from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "../../../../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { FilesAndFoldersMetadataMap } from "../../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
    getTagSize,
    sortTags,
    tagMapToArray,
} from "../../../../../reducers/tags/tags-selectors";
import type { TagMap } from "../../../../../reducers/tags/tags-types";
import { AllTagsItem as TagListItem } from "./all-tags-item";

export interface AllTagsProps {
    tags: TagMap;
    filesAndFolders: FilesAndFoldersMap;
    filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
    totalVolume: number;
    filesToDeleteSize: number;
    filesToDeleteCount: number;
    onDeleteTag: (tagId: string) => () => void;
    onRenameTag: (tagId: string) => (newName: string) => void;
}

const AllTags: React.FC<AllTagsProps> = ({
    tags,
    filesAndFolders,
    filesAndFoldersMetadata,
    totalVolume,
    filesToDeleteSize,
    filesToDeleteCount,
    onDeleteTag,
    onRenameTag,
}) => {
    const { t } = useTranslation();

    const tagsList = sortTags(tagMapToArray(tags))
        .map((tag) => {
            const size = getTagSize(
                tag,
                filesAndFolders,
                filesAndFoldersMetadata
            );

            return (
                <TagListItem
                    key={tag.id}
                    tag={tag.name}
                    size={size}
                    totalVolume={totalVolume}
                    tagNumber={tag.ffIds.length}
                    deleteTag={onDeleteTag(tag.id)}
                    renameTag={onRenameTag(tag.id)}
                />
            );
        })
        .reduce(
            (accumulator, value) => [...accumulator, value],
            [
                <TagListItem
                    key="to-delete"
                    tag={t("common.toDelete")}
                    size={filesToDeleteSize}
                    totalVolume={totalVolume}
                    tagNumber={filesToDeleteCount}
                />,
            ]
        );

    return (
        <Box
            display="flex"
            flexDirection="column"
            flexWrap="nowrap"
            height="100%"
        >
            <Box
                flex="1"
                flexBasis="0px"
                height="auto"
                minHeight="0px"
                minWidth="0px"
                width="100%"
            >
                <Box overflow="hidden auto" height="100%">
                    {tagsList}
                </Box>
            </Box>
        </Box>
    );
};

export interface AllTagsApiToPropsProps {
    tags: TagMap;
    renameTag: (tagId: string, name: string) => void;
    deleteTag: (tagId: string) => void;
}

export const AllTagsApiToProps: React.FC<AllTagsApiToPropsProps> = ({
    tags,
    renameTag,
    deleteTag,
}) => {
    const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
    const filesAndFoldersMetadata = useSelector(
        getFilesAndFoldersMetadataFromStore
    );
    const elementsToDelete = useSelector(getElementsToDeleteFromStore);

    const dispatch = useDispatch();

    const rootElementId = "";
    const totalVolume =
        filesAndFoldersMetadata[rootElementId].childrenTotalSize;

    const filesToDeleteCount = elementsToDelete.length;
    const filesToDeleteSize = useMemo(
        () =>
            getFilesTotalSize(
                elementsToDelete,
                filesAndFolders,
                filesAndFoldersMetadata
            ),
        [elementsToDelete, filesAndFolders, filesAndFoldersMetadata]
    );

    const onRenameTag: AllTagsProps["onRenameTag"] = (tagId) => (name) => {
        renameTag(tagId, name);
        dispatch(commitAction());
    };

    const onDeleteTag: AllTagsProps["onDeleteTag"] = (tagId) => () => {
        deleteTag(tagId);
        dispatch(commitAction());
    };

    return (
        <AllTags
            totalVolume={totalVolume}
            onRenameTag={onRenameTag}
            onDeleteTag={onDeleteTag}
            tags={tags}
            filesAndFolders={filesAndFolders}
            filesAndFoldersMetadata={filesAndFoldersMetadata}
            filesToDeleteSize={filesToDeleteSize}
            filesToDeleteCount={filesToDeleteCount}
        />
    );
};
