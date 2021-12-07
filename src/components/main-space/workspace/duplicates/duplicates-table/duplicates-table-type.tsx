import React from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";

import { colors } from "../../../../../util/color/color-util";
import type { FileType } from "../../../../../util/file-types/file-types-util";

export interface DuplicatesTableTypeProps {
    fileType: FileType;
}

export const DuplicatesTableType: React.FC<DuplicatesTableTypeProps> = ({
    fileType,
}) => {
    const { t } = useTranslation();
    return (
        <div>
            <FaCircle
                style={{
                    color: colors[fileType],
                    verticalAlign: "middle",
                }}
            />
            &nbsp;
            {t(`common.fileTypes.${fileType}`)}
        </div>
    );
};
