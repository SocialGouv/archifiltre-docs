import Box from "@material-ui/core/Box";
import CategoryTitle from "components/common/category-title";
import ColorCircle from "components/common/color-circle";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "components/main-space/icicle/icicle-enrichment";
import AllTagsButton from "components/workspace/all-tags-button";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

type TagHeaderProps = {
  api: any;
};

const TagHeader: FC<TagHeaderProps> = ({ api }) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="space-between">
      <CategoryTitle>
        {t("workspace.tags")}&nbsp;
        <ColorCircle color={ENRICHMENT_COLORS[EnrichmentTypes.TAG]} />
      </CategoryTitle>
      <AllTagsButton api={api} />
    </Box>
  );
};

export default TagHeader;
