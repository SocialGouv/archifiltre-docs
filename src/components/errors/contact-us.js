import React from "react";
import { useTranslation } from "react-i18next";
const { shell } = require("electron");

const sendMailToArchifiltre = () => {
  shell.openExternal("mailto:archifiltre@sg.social.gouv.fr");
};

export const ContactUs = () => {
  const { t } = useTranslation();
  return <a onClick={() => sendMailToArchifiltre()}>{t("common.contactUs")}</a>;
};
