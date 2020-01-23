import { shell } from "electron";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

/**
 * Opens the changelog in a browser
 * @param event
 */
const onWhatsNewClick = event => {
  event.preventDefault();
  shell.openExternal(`${ARCHIFILTRE_SITE_URL}/#changelog`);
};

const WhatsNewLink: FC = () => {
  const { t } = useTranslation();
  return (
    <a target="_blank" onClick={onWhatsNewClick} role="link">
      {t("report.whatsNew")}
    </a>
  );
};

export default WhatsNewLink;
