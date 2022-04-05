import React from "react";
import { useTranslation } from "react-i18next";

import { LargeIndicatorText } from "../../../../common/large-indicator-text";

export interface FileCountInfoProps {
  fileCount: number;
}

export const FileCountInfo: React.FC<FileCountInfoProps> = ({ fileCount }) => {
  const { t } = useTranslation();
  return (
    <LargeIndicatorText>
      {t("common.file", {
        count: fileCount,
      })}
    </LargeIndicatorText>
  );
};
