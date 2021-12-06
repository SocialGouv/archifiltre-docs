import React from "react";
import { useTranslation } from "react-i18next";

import { TabContentHeader } from "../tabs/tab-content-header";
import { makeTabComponent, TabsLayout } from "../tabs/tabs-layout";
import { TranslatedCategoryTitle } from "../tabs/translated-category-title";
import { AuditInfo } from "./audit-info";
import { FileTypesDetailsContainer } from "./file-types-details/files-types-details-container";

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

export const Audit: React.FC = () => {
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
