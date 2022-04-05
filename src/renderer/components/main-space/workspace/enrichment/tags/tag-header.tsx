import Box from "@material-ui/core/Box";
import React from "react";
import { useTranslation } from "react-i18next";

import { CategoryTitle } from "../../../../common/category-title";
import { ColorCircle } from "../../../../common/color-circle";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "../../../icicle/icicle-enrichment";
import { AllTagsButton } from "./all-tags-button";

export const TagHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="space-between">
      <CategoryTitle>
        {t("workspace.tags")}&nbsp;
        <ColorCircle color={ENRICHMENT_COLORS[EnrichmentTypes.TAG]} />
      </CategoryTitle>
      <AllTagsButton />
    </Box>
  );
};
