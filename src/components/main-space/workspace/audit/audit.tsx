import CategoryTitle from "components/common/category-title";
import AuditInfo from "./audit-info";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout from "components/main-space/workspace/tabs/tabs-layout";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import FileTypesDetailsContainer from "./file-types-details/files-types-details-container";

const Audit: FC = () => {
  const { t } = useTranslation();
  const components = [
    {
      title: <CategoryTitle>{t("audit.fileCountInfoTitle")}</CategoryTitle>,
      content: <AuditInfo />,
      widthRatio: 1,
    },
    {
      title: (
        <CategoryTitle>{t("audit.fileTypeRepartitionTitle")}</CategoryTitle>
      ),
      content: <FileTypesDetailsContainer />,
      widthRatio: 2,
    },
  ];
  return (
    <TabContentHeader title={t("audit.fileTreeAudit")}>
      <TabsLayout components={components} />
    </TabContentHeader>
  );
};

export default Audit;
