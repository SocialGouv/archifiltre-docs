import Chip from "@material-ui/core/Chip";
import { ToDeleteChip } from "components/common/to-delete-chip";
import React, { useCallback } from "react";
import type { Tag } from "reducers/tags/tags-types";

import EllipsisText from "./ellipsis-text";

interface TagCellChipsProps {
    tagsForCurrentFile: Tag[];
    untag: (tagId: string, nodeId: string) => void;
    nodeId: string;
    isCurrentFileMarkedToDelete: boolean;
    toggleCurrentFileDeleteState: () => void;
}

const TagCellChips: React.FC<TagCellChipsProps> = ({
    tagsForCurrentFile,
    untag,
    nodeId,
    isCurrentFileMarkedToDelete,
    toggleCurrentFileDeleteState,
}) => {
    const handleDelete = useCallback(
        (id) => () => {
            untag(id, nodeId);
        },
        [untag, nodeId]
    );

    return (
        <>
            <ToDeleteChip
                checked={isCurrentFileMarkedToDelete}
                onClick={toggleCurrentFileDeleteState}
            />
            {tagsForCurrentFile.map(({ id, name }) => (
                <Chip
                    size="small"
                    key={id}
                    label={<EllipsisText>{name}</EllipsisText>}
                    onDelete={handleDelete(id)}
                />
            ))}
        </>
    );
};

export default TagCellChips;
