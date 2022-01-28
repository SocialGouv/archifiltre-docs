import Grid from "@material-ui/core/Grid";
import React from "react";

import { DuplicatesChartContainer as DuplicatesChart } from "./duplicates-chart-container";
import { DuplicatesDistributionChartContainer as DuplicatesDistributionChart } from "./duplicates-distribution-chart-container";

export const DuplicatesDistribution: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <DuplicatesChart />
      </Grid>
      <Grid item xs={6}>
        <DuplicatesDistributionChart />
      </Grid>
    </Grid>
  );
};
