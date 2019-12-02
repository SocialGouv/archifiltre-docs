import React from "react";
import ArchifiltreMessage from "./archifiltre-message";
import { useTranslation } from "react-i18next";

const ErrorScreen = () => {
  const { t } = useTranslation();
  return <ArchifiltreMessage>{t("common.error")}</ArchifiltreMessage>;
};

export default ErrorScreen;
