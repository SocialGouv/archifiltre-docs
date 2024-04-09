import Box from "@mui/material/Box";
import React from "react";
import { useTranslation } from "react-i18next";

import { type Tag } from "../../../../../reducers/tags/tags-types";
import { NoElementSelectedPlaceholder } from "../element-characteristics/no-element-selected-placeholder";
import { TagCellChips } from "./tag-cell-chips";
import { TagCellInput } from "./tag-cell-input";

export interface TagCellProps {
  availableTags: Tag[];
  createTag: (value: string, filesAndFoldersId: string) => void;
  isActive: boolean;
  isCurrentFileMarkedToDelete: boolean;
  nodeId: string;
  tagsForCurrentFile: Tag[];
  toggleCurrentFileDeleteState: () => void;
  untag: (tagId: string, nodeId: string) => void;
}

export const TagCell: React.FC<TagCellProps> = ({
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
      <TagCellInput availableTags={availableTags} createTag={createTag} nodeId={nodeId} />
    </Box>
  ) : (
    <NoElementSelectedPlaceholder title={t("workspace.yourTagsHere")} />
  );
};
