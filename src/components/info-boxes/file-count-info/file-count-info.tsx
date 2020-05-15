import styled from "styled-components";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LargeIndicatorText from "../common/large-indicator-text";
import InfoBoxPaper from "../common/info-box-paper";

interface FileCountInfoProps {
  fileCount: number;
}

const TitleWrapper = styled(Box)`
  padding-top: 12px;
  padding-bottom: 12px;
`;

const FileCountInfo: FC<FileCountInfoProps> = ({ fileCount }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <TitleWrapper>
        <Typography variant="h5">{t("audit.fileCountInfoTitle")}</Typography>
      </TitleWrapper>
      <Box>
        <InfoBoxPaper>
          <LargeIndicatorText>{fileCount}</LargeIndicatorText>
        </InfoBoxPaper>
      </Box>
    </Box>
  );
};

export default FileCountInfo;
