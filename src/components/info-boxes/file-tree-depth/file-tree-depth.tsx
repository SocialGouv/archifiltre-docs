import styled from "styled-components";
import { Box } from "@material-ui/core";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import InfoBoxPaper from "../common/info-box-paper";
import LargeIndicatorText from "../common/large-indicator-text";

interface FileTreeDepthProps {
  fileTreeDepth: number;
}

const TitleWrapper = styled(Box)`
  padding-top: 12px;
  padding-bottom: 12px;
`;

const FileTreeDepth: FC<FileTreeDepthProps> = ({ fileTreeDepth }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <TitleWrapper>
        <Typography variant="h5">{t("audit.fileTreeDepthTitle")}</Typography>
      </TitleWrapper>
      <Box>
        <InfoBoxPaper>
          <LargeIndicatorText>{fileTreeDepth}</LargeIndicatorText>
        </InfoBoxPaper>
      </Box>
    </Box>
  );
};

export default FileTreeDepth;
