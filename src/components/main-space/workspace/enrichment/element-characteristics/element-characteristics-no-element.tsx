import NoElementSelectedPlaceholder from "components/main-space/workspace/enrichment/element-characteristics/no-element-selected-placeholder";
import React from "react";
import { useTranslation } from "react-i18next";

const ElementCharacteristicsNoElement: React.FC = () => {
    const { t } = useTranslation();
    return (
        <NoElementSelectedPlaceholder title={t("report.noElementSelected")} />
    );
};

export default ElementCharacteristicsNoElement;
