import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import EllipsisText from "./ellipsis-text";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash, FaPen } from "react-icons/fa";
import { percent } from "util/numbers/numbers-util";
import EditableField from "components/common/editable-field";

type AllTagsItemProps = {
  tag;
  size: number;
  totalVolume: number;
  deleteTag?: () => void;
  tagNumber: number;
  renameTag?: (newName: string) => void;
};

const AllTagsItem: FC<AllTagsItemProps> = ({
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

  const startEditing = useCallback(() => setIsEditing(true), [setIsEditing]);

  const onInputChange = useCallback(
    (newValue) => {
      renameTag && renameTag(newValue);
      setIsEditing(false);
    },
    [setIsEditing]
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
          <span>{`${tagNumber} (${percent(size, totalVolume)}%)`}</span>
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

export default AllTagsItem;
