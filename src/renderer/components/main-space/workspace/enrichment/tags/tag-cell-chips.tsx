import Chip, { type ChipProps } from "@mui/material/Chip";
import React, { useCallback } from "react";

import { type Tag } from "../../../../../reducers/tags/tags-types";
import { ToDeleteChip } from "../../../../common/to-delete-chip";
import { EllipsisText } from "./ellipsis-text";

export interface TagCellChipsProps {
  isCurrentFileMarkedToDelete: boolean;
  nodeId: string;
  tagsForCurrentFile: Tag[];
  toggleCurrentFileDeleteState: () => void;
  untag: (tagId: string, nodeId: string) => void;
}

export const TagCellChips: React.FC<TagCellChipsProps> = ({
  tagsForCurrentFile,
  untag,
  nodeId,
  isCurrentFileMarkedToDelete,
  toggleCurrentFileDeleteState,
}) => {
  const handleDelete: (id: string) => NonNullable<ChipProps["onDelete"]> = useCallback(
    id => () => {
      untag(id, nodeId);
    },
    [untag, nodeId],
  );

  return (
    <>
      <ToDeleteChip checked={isCurrentFileMarkedToDelete} onClick={toggleCurrentFileDeleteState} />
      {tagsForCurrentFile.map(({ id, name }) => (
        <Chip size="small" key={id} label={<EllipsisText>{name}</EllipsisText>} onDelete={handleDelete(id)} />
      ))}
    </>
  );
};
