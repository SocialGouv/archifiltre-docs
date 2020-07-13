import Chip from "@material-ui/core/Chip";
import EllipsisText from "components/tags/ellipsis-text";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { Tag } from "reducers/tags/tags-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

// We need to use a specific call to makeStyles for Chip based components,
// as it seems there are still some bug when Mui default classes override makeStyles classes
// when used with Chip/Avatar components : https://github.com/mui-org/material-ui/issues/16456
const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    toDeleteChip: {
      backgroundColor: theme.palette.error.main,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.error.main,
      },
      color: "white",
      "& > svg": {
        color: "white",
      },
    },
  })
);

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
  const classes = useLocalStyles();

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
