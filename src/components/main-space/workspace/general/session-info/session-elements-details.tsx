import Grid from "@material-ui/core/Grid";
import React from "react";
import { useTranslation } from "react-i18next";

import { octet2HumanReadableFormat } from "../../../../../util/file-system/file-sys-util";
import { SessionElementsDetail } from "./session-elements-detail";

export interface SessionElementsDetailsProps {
  nbFiles: number;
  nbFolders: number;
  volume: number;
}

export const SessionElementsDetails: React.FC<SessionElementsDetailsProps> = ({
  nbFolders,
  nbFiles,
  volume,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <SessionElementsDetail
          title={t("report.folders")}
          content={nbFolders}
        />
      </Grid>
      <Grid item>
        <SessionElementsDetail title={t("report.files")} content={nbFiles} />
      </Grid>
      <Grid item>
        <SessionElementsDetail
          title={t("report.size")}
          content={octet2HumanReadableFormat(volume)}
        />
      </Grid>
    </Grid>
  );
};
