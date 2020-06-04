import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import { useTranslation } from "react-i18next";
import { FaHandPointer } from "react-icons/fa";

const ElementCharacteristicsPlaceholder: FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <FaHandPointer />
      &nbsp;
      {t("report.noElementSelected")}
    </Box>
  );
};

export default ElementCharacteristicsPlaceholder;
