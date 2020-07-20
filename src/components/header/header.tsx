import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";

import Dashboard from "components/header/dashboard/dashboard-container";

const Header: FC = () => {
  return (
    <Grid container>
      <Dashboard />
    </Grid>
  );
};

export default Header;
