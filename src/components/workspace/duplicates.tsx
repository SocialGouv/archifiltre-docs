import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";
import DuplicatesDistribution from "../info-boxes/duplicates-distribution/duplicates-distribution";

const Duplicates: FC = () => (
  <Grid container spacing={1}>
    <Grid item xs={6}>
      <DuplicatesDistribution />
    </Grid>
    <Grid item xs={6}>
      Work in progress
    </Grid>
  </Grid>
);

export default Duplicates;
