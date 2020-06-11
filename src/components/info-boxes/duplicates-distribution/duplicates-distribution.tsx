import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@material-ui/core";
import CategoryTitle from "../../common/category-title";
import InfoBoxPaper from "../common/info-box-paper";
import DuplicatesChart from "./duplicates-chart-container";
import DuplicatesDistributionChart from "./duplicates-distribution-chart-container";

const DuplicatesDistribution: FC = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        <CategoryTitle>{t("duplicates.duplicatesDistribution")}</CategoryTitle>
      </Box>
      <Box flexGrow={1}>
        <InfoBoxPaper>
          <Grid container>
            <Grid item xs={6}>
              <DuplicatesChart />
            </Grid>
            <Grid item xs={6}>
              <DuplicatesDistributionChart />
            </Grid>
          </Grid>
        </InfoBoxPaper>
      </Box>
    </Box>
  );
};

export default DuplicatesDistribution;
