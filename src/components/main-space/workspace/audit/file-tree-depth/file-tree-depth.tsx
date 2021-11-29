import { LargeIndicatorText } from "components/common/large-indicator-text";
import React from "react";
import { useTranslation } from "react-i18next";

interface FileTreeDepthProps {
    fileTreeDepth: number;
}

const FileTreeDepth: React.FC<FileTreeDepthProps> = ({ fileTreeDepth }) => {
    const { t } = useTranslation();
    return (
        <LargeIndicatorText>{`${fileTreeDepth} ${t(
            "common.level_plural"
        )}`}</LargeIndicatorText>
    );
};

export default FileTreeDepth;
