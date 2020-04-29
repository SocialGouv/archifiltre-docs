import React from "react";

import { epochToFormattedUtcDateString } from "util/date/date-util";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";

const LastModifiedReporter = ({
  filesAndFoldersId,
  placeholder,
  filesAndFoldersMetadata,
}) => {
  const { t } = useTranslation();
  let maxDate = "...";
  let medianDate = "...";
  let minDate = "...";

  if (placeholder === false) {
    const metadata = filesAndFoldersMetadata[filesAndFoldersId];
    maxDate = epochToFormattedUtcDateString(metadata.maxLastModified);
    medianDate = epochToFormattedUtcDateString(metadata.medianLastModified);
    minDate = epochToFormattedUtcDateString(metadata.minLastModified);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <b>{t("report.lastModified")} :</b>
      </Grid>

      <Grid item xs={4}>
        {t("report.min")} :
      </Grid>
      <Grid item xs={8}>
        {minDate}
      </Grid>

      <Grid item xs={4}>
        {t("report.median")} :
      </Grid>
      <Grid item xs={8}>
        {medianDate}
      </Grid>

      <Grid item xs={4}>
        {t("report.max")} :
      </Grid>
      <Grid item xs={8}>
        {maxDate}
      </Grid>
    </Grid>
  );
};

export default LastModifiedReporter;
