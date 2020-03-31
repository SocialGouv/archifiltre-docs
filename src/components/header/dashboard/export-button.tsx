import React, { FC } from "react";
import { FaDownload } from "react-icons/fa";
import { useModal } from "../../../hooks/use-modal";
import Button, { ButtonAngles } from "../../common/button";
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
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        id="settings-button"
        angles={ButtonAngles.ROUNDED}
        onClick={openModal}
      >
        <FaDownload />
      </Button>
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
