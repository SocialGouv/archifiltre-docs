import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import LargeIndicatorText from "components/common/large-indicator-text";

type FileTreeDepthProps = {
  fileTreeDepth: number;
};

const FileTreeDepth: FC<FileTreeDepthProps> = ({ fileTreeDepth }) => {
  const { t } = useTranslation();
  return (
    <LargeIndicatorText>{`${fileTreeDepth} ${t(
      "common.level_plural"
    )}`}</LargeIndicatorText>
  );
};

export default FileTreeDepth;
