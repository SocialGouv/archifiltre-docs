import ColorCircle from "components/common/color-circle";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
  makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import TagHeader from "components/main-space/workspace/enrichment/tags/tag-header";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "components/main-space/icicle/icicle-enrichment";
import ElementCharacteristicsContainer from "./element-characteristics/element-characteristics-container";
import CommentCellContainer from "../general/comment-cell-container";
import TagCellContainer from "components/main-space/workspace/enrichment/tags/tag-cell-container";

type EnrichmentProps = {
  createTag;
  untag;
  updateComment;
  currentFileComment: string;
  tagsForCurrentFile;
  isCurrentFileMarkedToDelete: boolean;
  toggleCurrentFileDeleteState;
  nodeId: string;
  isActive: boolean;
};

const EnrichmentTitle = ({ title, type }) => {
  const { t } = useTranslation();
  return (
    <>
      {t(title)}
      <ColorCircle color={ENRICHMENT_COLORS[type]} />
    </>
  );
};

const ElementCharacteristicsContainerTab = makeTabComponent({
  title: (
    <EnrichmentTitle title="report.element" type={EnrichmentTypes.ALIAS} />
  ),
  content: <ElementCharacteristicsContainer />,
});

const CommentCellContainerTab = makeTabComponent({
  title: (
    <EnrichmentTitle title="report.comments" type={EnrichmentTypes.COMMENT} />
  ),
  content: <CommentCellContainer />,
});

const TagCellContainerTab = makeTabComponent({
  title: <TagHeader />,
  content: <TagCellContainer />,
  isLast: true,
});

const Enrichment: FC<EnrichmentProps> = () => {
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

export default Enrichment;
