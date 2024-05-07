import { Hashicon as HashIcon } from "@emeraldpay/hashicon-react/lib/component";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaAtom } from "react-icons/fa";

export interface HashInfoProps {
  hash?: string;
}

export const HashInfo: React.FC<HashInfoProps> = ({ hash }) => {
  const { t } = useTranslation();
  const hashIconExplanation = t("report.hashIconExplanation");

  return (
    <span>
      <span>{hash ?? t("report.hashCalculateInProgress")}</span>&nbsp;
      <Tooltip title={hashIconExplanation}>
        <span>
          {hash ? <HashIcon value={hash} size={12} /> : <FaAtom size={12} />}
        </span>
      </Tooltip>
    </span>
  );
};
