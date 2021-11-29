import { CategoryTitle } from "components/common/category-title";
import React from "react";
import { useTranslation } from "react-i18next";

const TranslatedCategoryTitle = ({ title }) => {
    const { t } = useTranslation();
    return <CategoryTitle>{t(title)}</CategoryTitle>;
};

export default TranslatedCategoryTitle;
