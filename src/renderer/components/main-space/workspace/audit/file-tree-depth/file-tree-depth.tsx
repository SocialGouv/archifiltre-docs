import React from "react";
import { useTranslation } from "react-i18next";

import { LargeIndicatorText } from "../../../../common/large-indicator-text";

export interface FileTreeDepthProps {
  fileTreeDepth: number;
}

export const FileTreeDepth: React.FC<FileTreeDepthProps> = ({ fileTreeDepth }) => {
  const { t } = useTranslation();
  return <LargeIndicatorText>{t("common.level", { count: fileTreeDepth })}</LargeIndicatorText>;
};
