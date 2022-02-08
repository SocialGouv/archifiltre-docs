import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import dateFormat from "dateformat";
import React from "react";
import { useTranslation } from "react-i18next";

import { HelpTooltip } from "../../../../common/help-tooltip";
import { BoundaryDate } from "./boundary-date";

export interface WorkspaceBoundaryDatesProps {
  oldestFileTimestamp: number;
  newestFileTimestamp: number;
}

export const WorkspaceBoundaryDates: React.FC<WorkspaceBoundaryDatesProps> = ({
  oldestFileTimestamp,
  newestFileTimestamp,
}) => {
  const { t } = useTranslation();
  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <Typography variant="h5">
          {t("report.boundaryDates")}&nbsp;
          <HelpTooltip tooltipText={t("report.boundaryDatesExplanation")} />
        </Typography>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid item>
            <BoundaryDate
              title={t("report.oldestFile")}
              content={dateFormat(oldestFileTimestamp, "dd/mm/yyyy")}
            />
          </Grid>
          <Grid item>
            <BoundaryDate
              title={t("report.newestFile")}
              content={dateFormat(newestFileTimestamp, "dd/mm/yyyy")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
