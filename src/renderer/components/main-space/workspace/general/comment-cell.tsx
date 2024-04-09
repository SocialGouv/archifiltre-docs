import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { EditableField } from "../../../common/editable-field";
import { NoElementSelectedPlaceholder } from "../enrichment/element-characteristics/no-element-selected-placeholder";

export interface CommentCellProps {
  comment: string;
  isActive: boolean;
  updateComment: (newComment: string) => void;
}

export const CommentCell: React.FC<CommentCellProps> = ({ isActive, comment, updateComment }) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (newComment: string) => {
      updateComment(newComment);
    },
    [updateComment],
  );

  return isActive ? (
    <EditableField
      multiline={true}
      trimValue={true}
      selectTextOnFocus={true}
      value={comment}
      data-test-id="comment-edit-box"
      onChange={handleChange}
      placeholder={t("report.clickHereToAddComments")}
      rowsMax={8}
    />
  ) : (
    <NoElementSelectedPlaceholder title={t("report.yourCommentsHere")} />
  );
};
