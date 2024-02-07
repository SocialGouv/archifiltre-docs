import Grid from "@material-ui/core/Grid";
import React from "react";
import { useTranslation } from "react-i18next";

import { bytes2HumanReadableFormat } from "../../../../../utils/file-system/file-sys-util";
import { SessionElementsDetail } from "./session-elements-detail";

export interface SessionElementsDetailsProps {
  archivesCount: number;
  filesCount: number;
  foldersCount: number;
  volume: number;
}

export const SessionElementsDetails: React.FC<SessionElementsDetailsProps> = ({
  foldersCount,
  archivesCount,
  filesCount,
  volume,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <SessionElementsDetail
          title={t("report.folders")}
          content={foldersCount}
        />
      </Grid>
      <Grid item>
        <SessionElementsDetail
          title={t("report.archive")}
          content={archivesCount}
        />
      </Grid>
      <Grid item>
        <SessionElementsDetail title={t("report.files")} content={filesCount} />
      </Grid>
      <Grid item>
        <SessionElementsDetail
          title={t("report.size")}
          content={bytes2HumanReadableFormat(volume)}
        />
      </Grid>
    </Grid>
  );
};
