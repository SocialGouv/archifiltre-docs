import Box from "@material-ui/core/Box";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaHandPointer } from "react-icons/fa";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import EditableField from "../fields/editable-field";

type CommentCellProps = {
  isActive: boolean;
  comment: string;
  updateComment: (newComment: string) => void;
};

const CommentCell: FC<CommentCellProps> = ({
  isActive,
  comment,
  updateComment,
}) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (newComment: string) => {
      updateComment(newComment);
      addTracker({
        title: ActionTitle.DESCRIPTION_ADDED,
        type: ActionType.TRACK_EVENT,
        value: `Created description: "${newComment}"`,
        eventValue: newComment,
      });
    },
    [updateComment]
  );

  return isActive ? (
    <EditableField
      multiline={true}
      trimValue={true}
      selectTextOnFocus={true}
      value={comment}
      onChange={handleChange}
      placeholder={t("report.yourCommentsHere")}
      rowsMax={8}
    />
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <FaHandPointer />
      &nbsp;
      {t("report.yourCommentsHere")}
    </Box>
  );
};

export default CommentCell;
