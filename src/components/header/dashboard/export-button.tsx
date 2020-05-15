import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { useModal } from "hooks/use-modal";
import { useStyles } from "../../../hooks/use-styles";
import {
  ExportToAuditReport,
  ExportToCsv,
  ExportToMets,
  ExportToResip,
} from "../../common/export-types";
import ExportModal from "../../modals/export-modal/export-modal";

interface ExportButtonProps {
  areHashesReady: boolean;
  exportToAuditReport: ExportToAuditReport;
  exportToMets: ExportToMets;
  exportToResip: ExportToResip;
  exportToCsv: ExportToCsv;
}

const ExportButton: FC<ExportButtonProps> = ({
  areHashesReady,
  exportToAuditReport,
  exportToMets,
  exportToResip,
  exportToCsv,
}) => {
  const { t } = useTranslation();
  const { isModalOpen, openModal, closeModal } = useModal();
  const classes = useStyles();
  const title = t("header.export");

  return (
    <>
      <Tooltip title={title}>
        <Button
          id="settings-button"
          color="primary"
          variant="contained"
          className={classes.headerButton}
          onClick={openModal}
          disableElevation
        >
          <FaDownload />
        </Button>
      </Tooltip>
      <ExportModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        areHashesReady={areHashesReady}
        exportToAuditReport={exportToAuditReport}
        exportToMets={exportToMets}
        exportToResip={exportToResip}
        exportToCsv={exportToCsv}
      />
    </>
  );
};

export default ExportButton;
