import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import React, { FC } from "react";
import { useStyles } from "hooks/use-styles";
import ModalHeader from "../../modals/modal-header";
import { useTranslation } from "react-i18next";
import ErrorsTable from "./errors-table";
import { DialogActions } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ArchifiltreError } from "util/error/error-util";

type ModalAction = {
  id: string;
  title: string;
  action: (errors: ArchifiltreError[]) => void;
};

type ErrorsModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  errors: ArchifiltreError[];
  actions?: ModalAction[];
};

const ErrorsModal: FC<ErrorsModalProps> = ({
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
            <Button key={id} color="primary" onClick={() => action(errors)}>
              {title}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ErrorsModal;
