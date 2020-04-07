import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../common/button";
import {
  ExportToAuditReport,
  ExportToCsv,
  ExportToMets,
  ExportToResip,
} from "../../common/export-types";
import ModalHeader from "../../modals/modal-header";
import Modal from "react-modal";
import ExportCheckboxes from "./export-checkboxes";

const modalStyle = {
  content: {
    width: "50%",
    height: "50%",
    transform: "translate(50%, 50%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
};

interface ExportModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  areHashesReady: boolean;
  exportToAuditReport: ExportToAuditReport;
  exportToMets: ExportToMets;
  exportToResip: ExportToResip;
  exportToCsv: ExportToCsv;
}

const ExportModal: FC<ExportModalProps> = ({
  isModalOpen,
  closeModal,
  areHashesReady,
  exportToAuditReport,
  exportToMets,
  exportToResip,
  exportToCsv,
}) => {
  const { t } = useTranslation();
  const [exportFunctions, setExportFunctions] = useState<(() => void)[]>([]);
  const onExport = useCallback(
    () => exportFunctions.forEach((exportFunction) => exportFunction()),
    [exportFunctions]
  );

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyle}>
      <ModalHeader title={t("exportModal.title")} onClose={closeModal} />
      <ExportCheckboxes
        areHashesReady={areHashesReady}
        exportToAuditReport={exportToAuditReport}
        exportToMets={exportToMets}
        exportToResip={exportToResip}
        exportToCsv={exportToCsv}
        setExportFunctions={setExportFunctions}
      />
      <Button
        id="export-button"
        disabled={exportFunctions.length === 0}
        onClick={onExport}
      >
        {t("exportModal.buttonTitle")}
      </Button>
    </Modal>
  );
};

export default ExportModal;
