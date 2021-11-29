import { ColorCircle } from "components/common/color-circle";
import {
    ENRICHMENT_COLORS,
    EnrichmentTypes,
} from "components/main-space/icicle/icicle-enrichment";
import TagCellContainer from "components/main-space/workspace/enrichment/tags/tag-cell-container";
import TagHeader from "components/main-space/workspace/enrichment/tags/tag-header";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
    makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import React from "react";
import { useTranslation } from "react-i18next";

import CommentCellContainer from "../general/comment-cell-container";
import ElementCharacteristicsContainer from "./element-characteristics/element-characteristics-container";

interface EnrichmentProps {
    createTag;
    untag;
    updateComment;
    currentFileComment: string;
    tagsForCurrentFile;
    isCurrentFileMarkedToDelete: boolean;
    toggleCurrentFileDeleteState;
    nodeId: string;
    isActive: boolean;
}

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
    content: <ElementCharacteristicsContainer />,
    title: (
        <EnrichmentTitle title="report.element" type={EnrichmentTypes.ALIAS} />
    ),
});

const CommentCellContainerTab = makeTabComponent({
    content: <CommentCellContainer />,
    title: (
        <EnrichmentTitle
            title="report.comments"
            type={EnrichmentTypes.COMMENT}
        />
    ),
});

const TagCellContainerTab = makeTabComponent({
    content: <TagCellContainer />,
    isLast: true,
    title: <TagHeader />,
});

const Enrichment: React.FC<EnrichmentProps> = () => {
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
