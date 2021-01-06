import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { ContactUs } from "./contact-us";
import { Box } from "@material-ui/core";
import logo from "../../../static/imgs/logo.png";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { reloadApp } from "util/electron/electron-util";

const ErrorScreen: FC = () => {
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
        <img alt="logo-archifiltre" src={logo} width={222} height={33} />
      </Box>
      <Box p={2}>
        <Typography variant="h4">{t("common.error")}</Typography>
      </Box>
      <Box p={2}>
        <ContactUs />
      </Box>
      <Box p={2}>
        <Button variant="outlined" color="primary" onClick={reloadApp}>
          Revenir à l'écran d'accueil
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorScreen;
