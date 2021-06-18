import AuditInfo from "./audit-info";
import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
  makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import FileTypesDetailsContainer from "./file-types-details/files-types-details-container";
import TranslatedCategoryTitle from "../tabs/translated-category-title";

const AuditInfoTab = makeTabComponent({
  title: <TranslatedCategoryTitle title="audit.fileCountInfoTitle" />,
  content: <AuditInfo />,
});

const FilesTypesDetails = makeTabComponent({
  title: <TranslatedCategoryTitle title="audit.fileTypeRepartitionTitle" />,
  content: <FileTypesDetailsContainer />,
  isLast: true,
  widthRatio: 2,
});

const Audit: FC = () => {
  const { t } = useTranslation();

  return (
    <TabContentHeader title={t("audit.fileTreeAudit")}>
      <TabsLayout>
        <AuditInfoTab />
        <FilesTypesDetails />
      </TabsLayout>
    </TabContentHeader>
  );
};

export default Audit;
