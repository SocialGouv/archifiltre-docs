import React from "react";
import { useTranslation } from "react-i18next";

import { ColorCircle } from "../../../common/color-circle";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "../../icicle/icicle-enrichment";
import { CommentCellContainer } from "../general/comment-cell-container";
import { TabContentHeader } from "../tabs/tab-content-header";
import { makeTabComponent, TabsLayout } from "../tabs/tabs-layout";
import { ElementCharacteristicsContainer } from "./element-characteristics/element-characteristics-container";
import { TagCellContainer } from "./tags/tag-cell-container";
import { TagHeader } from "./tags/tag-header";

export interface EnrichmentProps {
  createTag?: unknown; // -- unused?
  untag?: unknown; // -- unused?
  updateComment?: unknown; // -- unused?
  currentFileComment: string;
  tagsForCurrentFile?: unknown; // -- unused?
  isCurrentFileMarkedToDelete: boolean;
  toggleCurrentFileDeleteState?: unknown; // -- unused?
  nodeId: string;
  isActive: boolean;
}

interface EnrichmentTitleProps {
  title: string;
  type: EnrichmentTypes;
}
const EnrichmentTitle: React.FC<EnrichmentTitleProps> = ({ title, type }) => {
  const { t } = useTranslation();
  return (
    <>
      {t(title)}
      <ColorCircle color={ENRICHMENT_COLORS[type]} />
    </>
  );
};

const ElementCharacteristicsContainerTab = makeTabComponent({
  content: <ElementCharacteristicsContainer />,
  title: (
    <EnrichmentTitle title="report.element" type={EnrichmentTypes.ALIAS} />
  ),
});

const CommentCellContainerTab = makeTabComponent({
  content: <CommentCellContainer />,
  title: (
    <EnrichmentTitle title="report.comments" type={EnrichmentTypes.COMMENT} />
  ),
});

const TagCellContainerTab = makeTabComponent({
  content: <TagCellContainer />,
  isLast: true,
  title: <TagHeader />,
});

export const Enrichment: React.FC<EnrichmentProps> = () => {
  const { t } = useTranslation();

  return (
    <TabContentHeader title={t("workspace.metadata")}>
      <TabsLayout>
        <ElementCharacteristicsContainerTab />
        <CommentCellContainerTab />
        <TagCellContainerTab />
      </TabsLayout>
    </TabContentHeader>
  );
};
