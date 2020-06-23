import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "hooks/use-styles";
import {
  ExportToAuditReport,
  ExportToCsv,
  ExportToMets,
  ExportToResip,
} from "../../common/export-types";
import ModalHeader from "../../modals/modal-header";
import ExportCheckboxes from "./export-checkboxes";

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
  const classes = useStyles();
  const [exportFunctions, setExportFunctions] = useState<(() => void)[]>([]);
  const onExport = useCallback(
    () => exportFunctions.forEach((exportFunction) => exportFunction()),
    [exportFunctions]
  );

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
      <ModalHeader title={t("exportModal.title")} onClose={closeModal} />
      <DialogContent className={classes.dialogContent}>
        <ExportCheckboxes
          areHashesReady={areHashesReady}
          exportToAuditReport={exportToAuditReport}
          exportToMets={exportToMets}
          exportToResip={exportToResip}
          exportToCsv={exportToCsv}
          setExportFunctions={setExportFunctions}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={exportFunctions.length === 0}
          onClick={onExport}
        >
          {t("exportModal.buttonTitle")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
