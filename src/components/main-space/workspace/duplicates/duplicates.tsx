import React from "react";
import { useTranslation } from "react-i18next";

import { TabContentHeader } from "../tabs/tab-content-header";
import { makeTabComponent, TabsLayout } from "../tabs/tabs-layout";
import { TranslatedCategoryTitle } from "../tabs/translated-category-title";
import { DuplicatesDistribution } from "./duplicates-distribution/duplicates-distribution";
import { DuplicatesTableContainer as DuplicatesTable } from "./duplicates-table/duplicates-table-container";

const DuplicatesDistributionTab = makeTabComponent({
  content: <DuplicatesDistribution />,
  title: <TranslatedCategoryTitle title="duplicates.duplicatesDistribution" />,
});

const DuplicatesTableTab = makeTabComponent({
  content: <DuplicatesTable />,
  isLast: true,
  title: <TranslatedCategoryTitle title="duplicates.duplicatesByType" />,
});

export const Duplicates: React.FC = () => {
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
