import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@material-ui/core";
import CategoryTitle from "../../common/category-title";
import InfoBoxPaper from "../common/info-box-paper";
import DuplicatesChart from "./duplicates-chart-container";
import DuplicatesDistributionChart from "./duplicates-distribution-chart-container";

const TitleWrapper = styled(Box)`
  padding-top: 12px;
  padding-bottom: 12px;
`;

const DuplicatesDistribution: FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <TitleWrapper>
        <CategoryTitle>{t("duplicates.duplicatesDistribution")}</CategoryTitle>
      </TitleWrapper>
      <Box>
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
