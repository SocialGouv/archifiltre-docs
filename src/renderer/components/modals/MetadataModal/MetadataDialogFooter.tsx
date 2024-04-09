import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import React from "react";
import { useTranslation } from "react-i18next";

import { type ModalAction } from "./MetadataModalTypes";

interface MetadataDialogFooterProps<T> {
  actions: Array<ModalAction<T>>;
  closeModal: () => void;
  onAction: (actionId: T) => void;
}

export function MetadataDialogFooter<T>({
  actions,
  closeModal,
  onAction,
}: MetadataDialogFooterProps<T>): React.ReactElement {
  const { t } = useTranslation();
  return (
    <DialogActions>
      {actions.map(({ id, label }) => (
        <Button
          key={`action-${id}`}
          color="primary"
          variant="contained"
          disableElevation
          onClick={() => {
            onAction(id);
          }}
        >
          {t(`importModal.${label}`)}
        </Button>
      ))}
      <Button color="secondary" variant="contained" disableElevation onClick={closeModal}>
        {t("importModal.close")}
      </Button>
    </DialogActions>
  );
}
