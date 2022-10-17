import { Typography } from "@material-ui/core";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

const MetadataModalPreviewHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <Typography variant="body2">
      {t("importModal.importedFieldsSelectionDescription")}
    </Typography>
  );
};

export default MetadataModalPreviewHeader;
