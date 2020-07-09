import CategoryTitle from "components/common/category-title";
import AuditInfo from "components/workspace/audit-info";
import TabContentHeader from "components/workspace/tabs/tab-content-header";
import TabsLayout from "components/workspace/tabs/tabs-layout";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import FileTypesDetailsContainer from "../info-boxes/file-types-details/files-types-details-container";

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
