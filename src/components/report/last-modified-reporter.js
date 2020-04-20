import React from "react";

import { epochToFormattedUtcDateString } from "../../util/date-util";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";

const RedDot = () => {
  return (
    <div
      style={{
        height: "0.5em",
        width: "0.5em",
        backgroundColor: "red",
        borderRadius: "50%",
        margin: "auto",
      }}
    />
  );
};

const BlackCursor = () => {
  return (
    <div
      style={{
        height: "1em",
        width: "0.2em",
        backgroundColor: "black",
        margin: "auto",
      }}
    />
  );
};

const LastModifiedReporter = ({
  filesAndFoldersId,
  placeholder,
  filesAndFoldersMetadata,
}) => {
  let lm_max = "...";
  let lm_median = "...";
  let lm_average = "...";
  let lm_min = "...";

  const { t } = useTranslation();

  if (placeholder === false) {
    const metadata = filesAndFoldersMetadata[filesAndFoldersId];
    lm_max = epochToFormattedUtcDateString(metadata.maxLastModified);
    lm_median = epochToFormattedUtcDateString(metadata.medianLastModified);
    lm_average = epochToFormattedUtcDateString(metadata.averageLastModified);
    lm_min = epochToFormattedUtcDateString(metadata.minLastModified);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <b>{t("report.lastModified")} :</b>
      </Grid>

      <Grid item xs={1}>
        <BlackCursor />
      </Grid>
      <Grid item xs={5}>
        {t("report.min")} :
      </Grid>
      <Grid item xs={6}>
        {lm_min}
      </Grid>

      <Grid item xs={1}>
        <RedDot />
      </Grid>
      <Grid item xs={5}>
        {t("report.average")} :
      </Grid>
      <Grid item xs={6}>
        {lm_average}
      </Grid>

      <Grid item xs={1}>
        <BlackCursor />
      </Grid>
      <Grid item xs={5}>
        {t("report.median")} :
      </Grid>
      <Grid item xs={6}>
        {lm_median}
      </Grid>

      <Grid item xs={1}>
        <BlackCursor />
      </Grid>
      <Grid item xs={5}>
        {t("report.max")} :
      </Grid>
      <Grid item xs={6}>
        {lm_max}
      </Grid>
    </Grid>
  );
};

export default LastModifiedReporter;
