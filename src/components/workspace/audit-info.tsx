import Box from "@material-ui/core/Box";
import CategoryTitle from "components/common/category-title";
import FileCountInfoContainer from "components/info-boxes/file-count-info/file-count-info-container";
import FileTreeDepthContainer from "components/info-boxes/file-tree-depth/file-tree-depth-container";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

const AuditInfo: FC = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box>
        <FileCountInfoContainer />
      </Box>
      <Box paddingTop={3}>
        <CategoryTitle>{t("audit.fileTreeDepthTitle")}</CategoryTitle>
      </Box>
      <Box>
        <FileTreeDepthContainer />
      </Box>
    </Box>
  );
};

export default AuditInfo;
