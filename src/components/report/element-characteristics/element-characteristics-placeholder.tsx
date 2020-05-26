import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import { useTranslation } from "react-i18next";

const ElementCharacteristicsPlaceholder: FC = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between">
      {t("report.noElementSelected")}
    </Box>
  );
};

export default ElementCharacteristicsPlaceholder;
