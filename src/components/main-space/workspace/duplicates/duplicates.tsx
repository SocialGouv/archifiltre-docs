import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
  makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import DuplicatesDistribution from "./duplicates-distribution/duplicates-distribution";
import DuplicatesTable from "components/main-space/workspace/duplicates/duplicates-table/duplicates-table-container";
import TranslatedCategoryTitle from "../tabs/translated-category-title";

const DuplicatesDistributionTab = makeTabComponent({
  title: <TranslatedCategoryTitle title="duplicates.duplicatesDistribution" />,
  content: <DuplicatesDistribution />,
});

const DuplicatesTableTab = makeTabComponent({
  title: <TranslatedCategoryTitle title="duplicates.duplicatesByType" />,
  content: <DuplicatesTable />,
  isLast: true,
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
