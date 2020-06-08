import { Chip } from "@material-ui/core";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { Tag } from "reducers/tags/tags-types";
import { useStyles } from "hooks/use-styles";

type TagCellChipsProps = {
  tagsForCurrentFile: Tag[];
  untag: (tagId: string, nodeId: string) => void;
  nodeId: string;
  isCurrentFileMarkedToDelete: boolean;
  toggleCurrentFileDeleteState: () => void;
};

const TagCellChips: FC<TagCellChipsProps> = ({
  tagsForCurrentFile,
  untag,
  nodeId,
  isCurrentFileMarkedToDelete,
  toggleCurrentFileDeleteState,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleDelete = useCallback(
    (id) => () => {
      untag(id, nodeId);
    },
    [untag, nodeId]
  );

  return (
    <>
      <Chip
        size="small"
        label={t("common.toDelete")}
        className={isCurrentFileMarkedToDelete ? classes.toDeleteChip : ""}
        onClick={toggleCurrentFileDeleteState}
        icon={<FaTrash style={{ height: "50%" }} />}
      />
      {tagsForCurrentFile.map(({ id, name }) => (
        <Chip size="small" key={id} label={name} onDelete={handleDelete(id)} />
      ))}
    </>
  );
};

export default TagCellChips;
