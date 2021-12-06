import React from "react";
import { useTranslation } from "react-i18next";

import { NoElementSelectedPlaceholder } from "./no-element-selected-placeholder";

export const ElementCharacteristicsNoElement: React.FC = () => {
    const { t } = useTranslation();
    return (
        <NoElementSelectedPlaceholder title={t("report.noElementSelected")} />
    );
};
