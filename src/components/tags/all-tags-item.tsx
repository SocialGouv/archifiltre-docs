import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import EllipsisText from "components/tags/ellipsis-text";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash, FaPen } from "react-icons/fa";
import { percent } from "util/numbers/numbers-util";
import EditableField from "../fields/editable-field";

interface AllTagsItemProps {
  tag;
  size: number;
  totalVolume: number;
  deleteTag: any;
  tagNumber: number;
  renameTag: any;
}

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
      renameTag(newValue);
      setIsEditing(false);
    },
    [setIsEditing]
  );

  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" justifyContent="center" pr={1}>
        <IconButton size="small" onClick={deleteTag}>
          <FaTrash />
        </IconButton>
      </Box>
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
    </Box>
  );
};

export default AllTagsItem;
