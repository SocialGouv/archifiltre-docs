import { EditableField } from "components/common/editable-field";
import NoElementSelectedPlaceholder from "components/main-space/workspace/enrichment/element-characteristics/no-element-selected-placeholder";
import { addTracker } from "logging/tracker";
import { ActionTitle, ActionType } from "logging/tracker-types";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface CommentCellProps {
    isActive: boolean;
    comment: string;
    updateComment: (newComment: string) => void;
}

const CommentCell: React.FC<CommentCellProps> = ({
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
                value: "Description created",
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
            placeholder={t("report.clickHereToAddComments")}
            rowsMax={8}
        />
    ) : (
        <NoElementSelectedPlaceholder title={t("report.yourCommentsHere")} />
    );
};

export default CommentCell;
