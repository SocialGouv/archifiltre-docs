import DuplicatesTable from "components/main-space/workspace/duplicates/duplicates-table/duplicates-table-container";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
    makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import TranslatedCategoryTitle from "../tabs/translated-category-title";
import DuplicatesDistribution from "./duplicates-distribution/duplicates-distribution";

const DuplicatesDistributionTab = makeTabComponent({
    content: <DuplicatesDistribution />,
    title: (
        <TranslatedCategoryTitle title="duplicates.duplicatesDistribution" />
    ),
});

const DuplicatesTableTab = makeTabComponent({
    content: <DuplicatesTable />,
    isLast: true,
    title: <TranslatedCategoryTitle title="duplicates.duplicatesByType" />,
});

const Duplicates: FC = () => {
    const { t } = useTranslation();

    return (
        <TabContentHeader title={t("workspace.duplicates")}>
            <TabsLayout>
                <DuplicatesDistributionTab />
                <DuplicatesTableTab />
            </TabsLayout>
        </TabContentHeader>
    );
};

export default Duplicates;
