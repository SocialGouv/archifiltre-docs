import Box from "@material-ui/core/Box";
import CategoryTitle from "components/common/category-title";
import ColorCircle from "components/common/color-circle";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "components/main-space/icicle/icicle-enrichment";
import AllTagsButton from "./all-tags-button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

const TagHeader: FC = () => {
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

export default TagHeader;
