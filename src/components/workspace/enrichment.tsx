import ColorCircle from "components/common/color-circle";
import TabContentHeader from "components/workspace/tabs/tab-content-header";
import TabsLayout from "components/workspace/tabs/tabs-layout";
import TagHeader from "components/workspace/tag-header";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  ENRICHMENT_COLORS,
  EnrichmentTypes,
} from "../main-space/icicle/icicle-enrichment";
import CommentCell from "../report/comment-cell";
import TagCell from "../tags/tag-cell-container";
import ElementCharacteristicsContainer from "../info-boxes/element-characteristics/element-characteristics-container";

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
  api: any;
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
  api,
}) => {
  const { t } = useTranslation();

  const components = [
    {
      title: (
        <>
          {t("report.metadataElement")}
          <ColorCircle color={ENRICHMENT_COLORS[EnrichmentTypes.ALIAS]} />
        </>
      ),
      content: <ElementCharacteristicsContainer />,
    },
    {
      title: (
        <>
          {t("report.metadataDescription")}
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
      title: <TagHeader api={api} />,
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
