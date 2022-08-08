import { Typography } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";

const ImportModalPreviewHeader = () => {
  const { t } = useTranslation();

  return (
    <Typography>
      {t("importModal.importedFieldsSelectionDescription")}
    </Typography>
  );
};

export default ImportModalPreviewHeader;
