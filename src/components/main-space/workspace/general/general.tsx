import React from "react";
import { useTranslation } from "react-i18next";

import { ElementCharacteristicsContainer } from "../enrichment/element-characteristics/element-characteristics-container";
import { TabContentHeader } from "../tabs/tab-content-header";
import { makeTabComponent, TabsLayout } from "../tabs/tabs-layout";
import { TranslatedCategoryTitle } from "../tabs/translated-category-title";
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

export const General: React.FC = () => {
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
