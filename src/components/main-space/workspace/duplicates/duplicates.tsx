import CategoryTitle from "components/common/category-title";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout from "components/main-space/workspace/tabs/tabs-layout";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import DuplicatesDistribution from "./duplicates-distribution/duplicates-distribution";
import DuplicatesTable from "components/main-space/workspace/duplicates/duplicates-table/duplicates-table-container";

const Duplicates: FC = () => {
  const { t } = useTranslation();

  const components = [
    {
      title: (
        <CategoryTitle>{t("duplicates.duplicatesDistribution")}</CategoryTitle>
      ),
      content: <DuplicatesDistribution />,
    },
    {
      title: <CategoryTitle>{t("duplicates.duplicatesByType")}</CategoryTitle>,
      content: <DuplicatesTable />,
    },
  ];
  return (
    <TabContentHeader title={t("workspace.duplicates")}>
      <TabsLayout components={components} />
    </TabContentHeader>
  );
};

export default Duplicates;
