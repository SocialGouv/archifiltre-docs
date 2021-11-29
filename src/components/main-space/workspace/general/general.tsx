import ElementCharacteristicsContainer from "components/main-space/workspace/enrichment/element-characteristics/element-characteristics-container";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
    makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import TranslatedCategoryTitle from "../tabs/translated-category-title";
import SessionInfoContainer from "./session-info/session-info-container";

const SessionInfo = makeTabComponent({
    content: <SessionInfoContainer />,
    title: <TranslatedCategoryTitle title="report.fileTree" />,
});

const ElementCharacteristics = makeTabComponent({
    content: <ElementCharacteristicsContainer />,
    isLast: true,
    title: <TranslatedCategoryTitle title="report.element" />,
});

const General: FC = () => {
    const { t } = useTranslation();

    return (
        <TabContentHeader title={t("report.info")}>
            <TabsLayout>
                <SessionInfo />
                <ElementCharacteristics />
            </TabsLayout>
        </TabContentHeader>
    );
};

export default General;
