import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";
import DuplicatesDistribution from "../info-boxes/duplicates-distribution/duplicates-distribution";
import DuplicatesTable from "../info-boxes/duplicates-table/duplicates-table-container";
import styled from "styled-components";

const StyledGrid = styled(Grid)`
  height: 100%;
`;

const Duplicates: FC = () => (
  <StyledGrid container spacing={1}>
    <StyledGrid item xs={6}>
      <DuplicatesDistribution />
    </StyledGrid>
    <StyledGrid item xs={6}>
      <DuplicatesTable />
    </StyledGrid>
  </StyledGrid>
);

export default Duplicates;
