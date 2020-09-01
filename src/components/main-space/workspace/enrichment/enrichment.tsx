import ColorCircle from "components/common/color-circle";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout from "components/main-space/workspace/tabs/tabs-layout";
import TagHeader from "components/main-space/workspace/enrichment/tags/tag-header";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "components/main-space/icicle/icicle-enrichment";
import CommentCell from "components/main-space/workspace/general/comment-cell";
import TagCell from "components/main-space/workspace/enrichment/tags/tag-cell-container";
import ElementCharacteristicsContainer from "./element-characteristics/element-characteristics-container";

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
const Enrichment: FC<EnrichmentProps> = ({
  createTag,
  untag,
  updateComment,
  currentFileComment,
  tagsForCurrentFile,
  isCurrentFileMarkedToDelete,
  toggleCurrentFileDeleteState,
  nodeId,
  isActive,
}) => {
  const { t } = useTranslation();

  const components = [
    {
      title: (
        <>
          {t("report.element")}
          <ColorCircle color={ENRICHMENT_COLORS[EnrichmentTypes.ALIAS]} />
        </>
      ),
      content: <ElementCharacteristicsContainer />,
    },
    {
      title: (
        <>
          {t("report.comments")}
          <ColorCircle color={ENRICHMENT_COLORS[EnrichmentTypes.COMMENT]} />
        </>
      ),
      content: (
        <CommentCell
          isActive={isActive}
          comment={currentFileComment}
          updateComment={updateComment}
        />
      ),
    },
    {
      title: <TagHeader />,
      content: (
        <TagCell
          isActive={isActive}
          isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
          nodeId={nodeId}
          tagsForCurrentFile={tagsForCurrentFile}
          createTag={createTag}
          untag={untag}
          toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
        />
      ),
    },
  ];

  return (
    <TabContentHeader title={t("workspace.metadata")}>
      <TabsLayout components={components} />
    </TabContentHeader>
  );
};

export default Enrichment;
