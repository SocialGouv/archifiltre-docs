import Box from "@material-ui/core/Box";
import React from "react";
import { useTranslation } from "react-i18next";

import { CategoryTitle } from "../../../common/category-title";
import { FileCountInfoContainer } from "./file-count-info/file-count-info-container";
import { FileTreeDepthContainer } from "./file-tree-depth/file-tree-depth-container";

export const AuditInfo: React.FC = () => {
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
