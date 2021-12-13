import Button from "@material-ui/core/Button";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowsAlt } from "react-icons/fa";
import styled from "styled-components";

import { addTracker } from "../../../logging/tracker";
import { ActionTitle, ActionType } from "../../../logging/tracker-types";
import { useFileMoveActiveState } from "../workspace/file-move-provider";

const handleTracking = (isFileMoveActive: boolean) => {
    if (!isFileMoveActive) {
        addTracker({
            title: ActionTitle.MOVE_MODE_ENABLED,
            type: ActionType.TRACK_EVENT,
        });
    }
};

const BetaText = styled.span`
    font-size: 0.5rem !important;
`;

export const MoveFilesButton: React.FC = () => {
    const { t } = useTranslation();
    const { isFileMoveActive, setIsFileMoveActive } = useFileMoveActiveState();
    const toggleMoveElements = useCallback(() => {
        handleTracking(isFileMoveActive);
        setIsFileMoveActive(!isFileMoveActive);
    }, [setIsFileMoveActive, isFileMoveActive]);

    return (
        <Button
            variant={isFileMoveActive ? "contained" : "outlined"}
            disableElevation={true}
            color="secondary"
            size="small"
            onClick={toggleMoveElements}
            startIcon={<FaArrowsAlt />}
            endIcon={<BetaText>BETA</BetaText>}
        >
            {t("workspace.moveElementsMode")}
        </Button>
    );
};
