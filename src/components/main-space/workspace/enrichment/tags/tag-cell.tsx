import Box from "@material-ui/core/Box";
import NoElementSelectedPlaceholder from "components/main-space/workspace/enrichment/element-characteristics/no-element-selected-placeholder";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Tag } from "reducers/tags/tags-types";

import TagCellChips from "./tag-cell-chips";
import TagCellInput from "./tag-cell-input";

interface TagCellProps {
    isActive: boolean;
    isCurrentFileMarkedToDelete: boolean;
    nodeId: string;
    tagsForCurrentFile: Tag[];
    createTag: (value: string, filesAndFoldersId: string) => void;
    untag: (tagId: string, nodeId: string) => void;
    toggleCurrentFileDeleteState: () => void;
    availableTags: Tag[];
}

const TagCell: React.FC<TagCellProps> = ({
    isActive,
    isCurrentFileMarkedToDelete,
    nodeId,
    tagsForCurrentFile,
    createTag,
    untag,
    toggleCurrentFileDeleteState,
    availableTags,
}) => {
    const { t } = useTranslation();

    return isActive ? (
        <Box>
            <TagCellChips
                tagsForCurrentFile={tagsForCurrentFile}
                untag={untag}
                nodeId={nodeId}
                isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
                toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
            />
            <TagCellInput
                availableTags={availableTags}
                createTag={createTag}
                nodeId={nodeId}
            />
        </Box>
    ) : (
        <NoElementSelectedPlaceholder title={t("workspace.yourTagsHere")} />
    );
};

export default TagCell;
