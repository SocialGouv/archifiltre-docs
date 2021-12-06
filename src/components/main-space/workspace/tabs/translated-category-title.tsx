import React from "react";
import { useTranslation } from "react-i18next";

import { CategoryTitle } from "../../../common/category-title";

export const TranslatedCategoryTitle: React.FC<{ title: string }> = ({
    title,
}) => {
    const { t } = useTranslation();
    return <CategoryTitle>{t(title)}</CategoryTitle>;
};
