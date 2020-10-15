import Button from "@material-ui/core/Button";
import React, { FC } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import { useTranslation } from "react-i18next";

type FilesAndFoldersErrorsFooterProps = {
  retry: () => void;
};

const FilesAndFoldersErrorsFooter: FC<FilesAndFoldersErrorsFooterProps> = ({
  retry,
}) => {
  const { t } = useTranslation();

  return (
    <DialogActions>
      <Button color="primary" onClick={retry}>
        {t("common.retry")}
      </Button>
    </DialogActions>
  );
};

export default FilesAndFoldersErrorsFooter;
