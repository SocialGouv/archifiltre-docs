import Box from "@material-ui/core/Box";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaHandPointer } from "react-icons/fa";
import { Tag } from "reducers/tags/tags-types";
import TagCellChips from "./tag-cell-chips";
import TagCellInput from "./tag-cell-input";

type TagCellProps = {
  isActive: boolean;
  isCurrentFileMarkedToDelete: boolean;
  nodeId: string;
  tagsForCurrentFile: Tag[];
  createTag: (value: string, filesAndFoldersId: string) => void;
  untag: (tagId: string, nodeId: string) => void;
  toggleCurrentFileDeleteState: () => void;
  availableTags: Tag[];
};

const TagCell: FC<TagCellProps> = ({
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
    <div>
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
    </div>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <FaHandPointer />
      &nbsp;
      {t("workspace.yourTagsHere")}
    </Box>
  );
};

export default TagCell;
