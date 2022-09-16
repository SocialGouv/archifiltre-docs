import { reloadApp } from "@common/utils/electron";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from "react-i18next";

import { Logo } from "../common/Logo";
import { ContactUs } from "./contact-us";

export const ErrorScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      flexDirection="column"
    >
      <Box p={2}>
        <Logo height={33} />
      </Box>
      <Box p={2}>
        <Typography variant="h4">{t("common.error")}</Typography>
      </Box>
      <Box p={2}>
        <ContactUs />
      </Box>
      <Box p={2}>
        <Button variant="outlined" color="primary" onClick={reloadApp}>
          {t("common.errorBack")}
        </Button>
      </Box>
    </Box>
  );
};
