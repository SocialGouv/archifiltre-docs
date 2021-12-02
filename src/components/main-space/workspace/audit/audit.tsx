import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
    makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import React from "react";
import { useTranslation } from "react-i18next";

import TranslatedCategoryTitle from "../tabs/translated-category-title";
import AuditInfo from "./audit-info";
import FileTypesDetailsContainer from "./file-types-details/files-types-details-container";

const AuditInfoTab = makeTabComponent({
    content: <AuditInfo />,
    title: <TranslatedCategoryTitle title="audit.fileCountInfoTitle" />,
});

const FilesTypesDetails = makeTabComponent({
    content: <FileTypesDetailsContainer />,
    isLast: true,
    title: <TranslatedCategoryTitle title="audit.fileTypeRepartitionTitle" />,
    widthRatio: 2,
});

const Audit: React.FC = () => {
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
