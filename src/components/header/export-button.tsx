import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { useModal } from "hooks/use-modal";
import { useStyles } from "hooks/use-styles";
import { useSelector } from "react-redux";
import { getAreHashesReady } from "reducers/files-and-folders/files-and-folders-selectors";
import ExportModal from "components/modals/export-modal/export-modal";

const ExportButton: FC = () => {
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
        <Badge color="error" variant="dot" invisible={!isBadgeShown}>
          <Button
            id="export-button"
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

export default ExportButton;
