import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useModal } from "../../../hooks/use-modal";
import { useStyles } from "../../../hooks/use-styles";
import { getAreHashesReady } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { ExportModal } from "../../modals/export-modal/export-modal";

export const ExportButton: React.FC = () => {
  const { t } = useTranslation();
  const { isModalOpen, openModal, closeModal } = useModal();
  const classes = useStyles();
  const title = t("header.export");
  const [isBadgeShown, setIsBadgeShown] = useState(false);
  const areHashesReady = useSelector(getAreHashesReady);

  useEffect(() => {
    if (areHashesReady) {
      setIsBadgeShown(true);
    }
  }, [areHashesReady]);

  const onClick = useCallback(() => {
    openModal();
    setIsBadgeShown(false);
  }, [openModal, setIsBadgeShown]);

  return (
    <>
      <Tooltip title={title}>
        <Badge
          color="error"
          overlap="rectangular"
          variant="dot"
          invisible={!isBadgeShown}
        >
          <Button
            id="export-button"
            data-test-id="export-menu"
            color="primary"
            variant="contained"
            className={classes.headerButton}
            onClick={onClick}
            disableElevation
          >
            <FaDownload />
          </Button>
        </Badge>
      </Tooltip>
      <ExportModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
