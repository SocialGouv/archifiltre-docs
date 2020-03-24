import React, { FC } from "react";
import ArchifiltreMessage from "./archifiltre-message";
import { useTranslation } from "react-i18next";

const ErrorScreen: FC = () => {
  const { t } = useTranslation();
  return <ArchifiltreMessage>{t("common.error")}</ArchifiltreMessage>;
};

export default ErrorScreen;
