import styled from "styled-components";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@material-ui/core";
import CategoryTitle from "../../common/category-title";
import LargeIndicatorText from "../common/large-indicator-text";
import InfoBoxPaper from "../common/info-box-paper";

interface FileCountInfoProps {
  fileCount: number;
}

const FileCountInfo: FC<FileCountInfoProps> = ({ fileCount }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <CategoryTitle>{t("audit.fileCountInfoTitle")}</CategoryTitle>
      <Box>
        <InfoBoxPaper>
          <LargeIndicatorText>{fileCount}</LargeIndicatorText>
        </InfoBoxPaper>
      </Box>
    </Box>
  );
};

export default FileCountInfo;
