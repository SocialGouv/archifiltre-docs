import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import React from "react";
import { useTranslation } from "react-i18next";

import type { ModalAction } from "./MetadataModalTypes";

interface MetadataDialogFooterProps<T> {
  actions: ModalAction<T>[];
  closeModal: () => void;
  onAction: (actionId: T) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function MetadataDialogFooter<T>({
  actions,
  closeModal,
  onAction,
}: MetadataDialogFooterProps<T>): React.ReactNode {
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
      <Button
        color="secondary"
        variant="contained"
        disableElevation
        onClick={closeModal}
      >
        {t("importModal.close")}
      </Button>
    </DialogActions>
  );
}
