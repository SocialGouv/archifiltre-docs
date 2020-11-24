import { useTranslation } from "react-i18next";
import NoElementSelectedPlaceholder from "components/main-space/workspace/enrichment/element-characteristics/no-element-selected-placeholder";
import React, { FC } from "react";

const ElementCharacteristicsNoElement: FC = () => {
  const { t } = useTranslation();
  return <NoElementSelectedPlaceholder title={t("report.noElementSelected")} />;
};

export default ElementCharacteristicsNoElement;
