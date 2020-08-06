import { Hashicon as HashIcon } from "@emeraldpay/hashicon-react/lib/component";
import { Tooltip } from "@material-ui/core";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

type HashInfoProps = {
  hash: string;
};

const HashInfo: FC<HashInfoProps> = ({ hash }) => {
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
