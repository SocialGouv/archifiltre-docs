import { formatSize, getPercentage } from "@common/utils/numbers";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPen, FaTrash } from "react-icons/fa";

import type { EditableFieldProps } from "../../../../common/editable-field";
import { EditableField } from "../../../../common/editable-field";
import { EllipsisText } from "./ellipsis-text";

export interface AllTagsItemProps {
  deleteTag?: () => void;
  renameTag?: (newName: string) => void;
  size: number;
  tag: string;
  tagNumber: number;
  totalVolume: number;
}

export const AllTagsItem: React.FC<AllTagsItemProps> = ({
  tag,
  size,
  totalVolume,
  deleteTag,
  tagNumber,
  renameTag,
}) => {
  const { t } = useTranslation();
  const tooltipText = useMemo(() => t("workspace.tagItemTooltip"), [t]);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const onInputChange: EditableFieldProps["onChange"] = useCallback(
    (newValue) => {
      renameTag?.(newValue);
      setIsEditing(false);
    },
    [setIsEditing, renameTag]
  );

  return (
    <Box display="flex">
      {deleteTag && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          pr={1}
        >
          <IconButton size="small" onClick={deleteTag}>
            <FaTrash />
          </IconButton>
        </Box>
      )}
      <Box display="flex" flexDirection="column" justifyContent="center" pr={1}>
        <Chip
          size="small"
          label={<EllipsisText maxWidth={150}>{tag}</EllipsisText>}
        />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" pr={1}>
        <Tooltip title={tooltipText}>
          <span>{`${tagNumber} (${getPercentage(
            size,
            totalVolume
          )}% - ${formatSize(size, t)})`}</span>
        </Tooltip>
      </Box>
      {renameTag && (
        <Box display="flex" flexDirection="column" justifyContent="center">
          {isEditing ? (
            <EditableField
              trimValue={true}
              selectTextOnFocus={true}
              value={tag}
              onChange={onInputChange}
            />
          ) : (
            <FaPen onClick={startEditing} />
          )}
        </Box>
      )}
    </Box>
  );
};
