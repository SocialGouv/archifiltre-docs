import Box from "@material-ui/core/Box";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import CategoryTitle from "../../common/category-title";
import InfoBoxPaper from "../common/info-box-paper";
import LargeIndicatorText from "../common/large-indicator-text";

interface FileTreeDepthProps {
  fileTreeDepth: number;
}

const FileTreeDepth: FC<FileTreeDepthProps> = ({ fileTreeDepth }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <CategoryTitle>{t("audit.fileTreeDepthTitle")}</CategoryTitle>
      <Box>
        <InfoBoxPaper>
          <LargeIndicatorText>{fileTreeDepth}</LargeIndicatorText>
        </InfoBoxPaper>
      </Box>
    </Box>
  );
};

export default FileTreeDepth;
