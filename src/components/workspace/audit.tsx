import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FileCountInfoContainer from "../info-boxes/file-count-info/file-count-info-container";
import FileTreeDepthContainer from "../info-boxes/file-tree-depth/file-tree-depth-container";
import FileTypesDetailsContainer from "../info-boxes/file-types-details/files-types-details-container";

const Audit: FC = () => (
  <Grid container spacing={1}>
    <Grid item sm={6}>
      <Box display="flex" flexDirection="column">
        <FileCountInfoContainer />
      </Box>
      <Box>
        <FileTreeDepthContainer />
      </Box>
    </Grid>
    <Grid item sm={6}>
      <FileTypesDetailsContainer />
    </Grid>
  </Grid>
);

export default Audit;
