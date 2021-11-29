import React from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import { colors } from "util/color/color-util";

interface DuplicatesTableTypeProps {
    fileType: string;
}

const DuplicatesTableType: React.FC<DuplicatesTableTypeProps> = ({
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

export default DuplicatesTableType;
