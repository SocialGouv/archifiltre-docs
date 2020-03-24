import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { shell } from "electron";

const sendMailToArchifiltre = () => {
  shell.openExternal("mailto:archifiltre@sg.social.gouv.fr");
};

export const ContactUs: FC = () => {
  const { t } = useTranslation();
  return <a onClick={() => sendMailToArchifiltre()}>{t("common.contactUs")}</a>;
};
