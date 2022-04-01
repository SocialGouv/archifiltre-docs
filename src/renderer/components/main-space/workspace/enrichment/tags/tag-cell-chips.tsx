import type { ChipProps } from "@material-ui/core/Chip";
import Chip from "@material-ui/core/Chip";
import React, { useCallback } from "react";

import type { Tag } from "../../../../../reducers/tags/tags-types";
import { ToDeleteChip } from "../../../../common/to-delete-chip";
import { EllipsisText } from "./ellipsis-text";

export interface TagCellChipsProps {
  tagsForCurrentFile: Tag[];
  untag: (tagId: string, nodeId: string) => void;
  nodeId: string;
  isCurrentFileMarkedToDelete: boolean;
  toggleCurrentFileDeleteState: () => void;
}

export const TagCellChips: React.FC<TagCellChipsProps> = ({
  tagsForCurrentFile,
  untag,
  nodeId,
  isCurrentFileMarkedToDelete,
  toggleCurrentFileDeleteState,
}) => {
  const handleDelete: (id: string) => NonNullable<ChipProps["onDelete"]> =
    useCallback(
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