import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";
import DuplicatesChart from "./duplicates-chart-container";
import DuplicatesDistributionChart from "./duplicates-distribution-chart-container";

const DuplicatesDistribution: FC = () => {
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

export default DuplicatesDistribution;
