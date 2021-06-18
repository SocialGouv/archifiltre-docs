import React from "react";
import CategoryTitle from "components/common/category-title";
import { useTranslation } from "react-i18next";

const TranslatedCategoryTitle = ({ title }) => {
  const { t } = useTranslation();
  return <CategoryTitle>{t(title)}</CategoryTitle>;
};

export default TranslatedCategoryTitle;
