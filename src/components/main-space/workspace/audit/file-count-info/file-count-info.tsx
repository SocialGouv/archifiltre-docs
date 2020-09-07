import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import LargeIndicatorText from "components/common/large-indicator-text";

type FileCountInfoProps = {
  fileCount: number;
};

const FileCountInfo: FC<FileCountInfoProps> = ({ fileCount }) => {
  const { t } = useTranslation();
  return (
    <LargeIndicatorText>{`${fileCount} ${t(
      "common.file_plural"
    )}`}</LargeIndicatorText>
  );
};

export default FileCountInfo;
