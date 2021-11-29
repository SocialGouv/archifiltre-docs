import Box from "@material-ui/core/Box";
import { CategoryTitle } from "components/common/category-title";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import FileCountInfoContainer from "./file-count-info/file-count-info-container";
import FileTreeDepthContainer from "./file-tree-depth/file-tree-depth-container";

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
