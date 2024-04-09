import { Hashicon as HashIcon } from "@emeraldpay/hashicon-react/lib/component";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

export interface HashInfoProps {
  hash: string;
}

export const HashInfo: React.FC<HashInfoProps> = ({ hash }) => {
  const { t } = useTranslation();
  const hashIconExplanation = t("report.hashIconExplanation");

  return (
    <span>
      <span>{hash}</span>&nbsp;
      <Tooltip title={hashIconExplanation}>
        <span>
          {/* TODO: use simple icon */}
          <HashIcon value={hash} size={12} />
        </span>
      </Tooltip>
    </span>
  );
};
