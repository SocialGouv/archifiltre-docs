import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";

import Dashboard from "components/header/dashboard/dashboard-container";

interface HeaderProps {
  api: any;
}

const Header: FC<HeaderProps> = ({ api }) => {
  return (
    <Grid container>
      <Dashboard api={api} />
    </Grid>
  );
};

export default Header;
