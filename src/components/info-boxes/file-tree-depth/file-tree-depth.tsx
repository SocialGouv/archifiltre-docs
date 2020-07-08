import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import LargeIndicatorText from "../common/large-indicator-text";

interface FileTreeDepthProps {
  fileTreeDepth: number;
}

const FileTreeDepth: FC<FileTreeDepthProps> = ({ fileTreeDepth }) => {
  const { t } = useTranslation();
  return (
    <LargeIndicatorText>{`${fileTreeDepth} ${t(
      "common.level_plural"
    )}`}</LargeIndicatorText>
  );
};

export default FileTreeDepth;
