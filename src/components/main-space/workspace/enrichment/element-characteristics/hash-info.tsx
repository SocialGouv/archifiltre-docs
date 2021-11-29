import { Hashicon as HashIcon } from "@emeraldpay/hashicon-react/lib/component";
import { Tooltip } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";

interface HashInfoProps {
    hash: string;
}

const HashInfo: React.FC<HashInfoProps> = ({ hash }) => {
    const { t } = useTranslation();
    const hashIconExplanation = t("report.hashIconExplanation");

    return (
        <span>
            <span>{hash}</span>&nbsp;
            <Tooltip title={hashIconExplanation}>
                <span>
                    <HashIcon value={hash} size={12} />
                </span>
            </Tooltip>
        </span>
    );
};

export default HashInfo;
