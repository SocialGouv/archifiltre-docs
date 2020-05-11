import React, { FC } from "react";
import dateFormat from "dateformat";
import { useTranslation } from "react-i18next";
import Box from "@material-ui/core/Box";
import TextInfo from "../../text/text-info";
import BoundaryDate from "./boundary-date";
import Grid from "@material-ui/core/Grid";

interface BoundaryDatesProps {
  oldestFileTimestamp: number;
  newestFileTimestamp: number;
}

const BoundaryDates: FC<BoundaryDatesProps> = ({
  oldestFileTimestamp,
  newestFileTimestamp,
}) => {
  const { t } = useTranslation();
  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <TextInfo uppercase={true}>{t("report.boundaryDates")}</TextInfo>
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

export default BoundaryDates;
