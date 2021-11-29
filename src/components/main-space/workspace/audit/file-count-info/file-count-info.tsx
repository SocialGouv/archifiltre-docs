import { LargeIndicatorText } from "components/common/large-indicator-text";
import React from "react";
import { useTranslation } from "react-i18next";

interface FileCountInfoProps {
    fileCount: number;
}

const FileCountInfo: React.FC<FileCountInfoProps> = ({ fileCount }) => {
    const { t } = useTranslation();
    return (
        <LargeIndicatorText>{`${fileCount} ${t(
            "common.file_plural"
        )}`}</LargeIndicatorText>
    );
};

export default FileCountInfo;
