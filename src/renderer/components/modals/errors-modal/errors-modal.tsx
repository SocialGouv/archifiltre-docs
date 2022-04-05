import type { ArchifiltreDocsError } from "@common/utils/error";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import React from "react";
import { useTranslation } from "react-i18next";

import { useStyles } from "../../../hooks/use-styles";
import { ModalHeader } from "../modal-header";
import { ErrorsTable } from "./errors-table";

interface ModalAction {
  action: (errors: ArchifiltreDocsError[]) => void;
  id: string;
  title: string;
}

export interface ErrorsModalProps {
  actions?: ModalAction[];
  closeModal: () => void;
  errors: ArchifiltreDocsError[];
  isModalOpen: boolean;
}

export const ErrorsModal: React.FC<ErrorsModalProps> = ({
  isModalOpen,
  closeModal,
  errors,
  actions = [],
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="lg">
      <ModalHeader title={t("errorsModal.title")} onClose={closeModal} />
      <DialogContent className={classes.dialogContent}>
        <ErrorsTable errors={errors} />
      </DialogContent>
      {actions.length > 0 && (
        <DialogActions>
          {actions.map(({ id, title, action }) => (
            <Button
              key={id}
              color="primary"
              onClick={() => {
                action(errors);
              }}
            >
              {title}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};
