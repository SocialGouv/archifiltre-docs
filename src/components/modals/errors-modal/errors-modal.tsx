import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import React, { FC, ReactNode } from "react";
import { useStyles } from "hooks/use-styles";
import ModalHeader from "../../modals/modal-header";
import { useTranslation } from "react-i18next";
import { ArchifiltreError } from "reducers/loading-info/loading-info-types";
import ErrorsTable from "./errors-table";

type ErrorsModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  errors: ArchifiltreError[];
  footer?: ReactNode;
};

const ErrorsModal: FC<ErrorsModalProps> = ({
  isModalOpen,
  closeModal,
  errors,
  footer,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="lg">
      <ModalHeader title={t("errorsModal.title")} onClose={closeModal} />
      <DialogContent className={classes.dialogContent}>
        <ErrorsTable errors={errors} />
      </DialogContent>
      {footer}
    </Dialog>
  );
};

export default ErrorsModal;
