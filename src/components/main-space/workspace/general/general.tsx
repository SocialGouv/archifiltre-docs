import TabContentHeader from "components/main-space/workspace/tabs/tab-content-header";
import TabsLayout, {
  makeTabComponent,
} from "components/main-space/workspace/tabs/tabs-layout";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import ElementCharacteristicsContainer from "components/main-space/workspace/enrichment/element-characteristics/element-characteristics-container";
import SessionInfoContainer from "./session-info/session-info-container";
import TranslatedCategoryTitle from "../tabs/translated-category-title";

const SessionInfo = makeTabComponent({
  title: <TranslatedCategoryTitle title="report.fileTree" />,
  content: <SessionInfoContainer />,
});

const ElementCharacteristics = makeTabComponent({
  title: <TranslatedCategoryTitle title="report.element" />,
  content: <ElementCharacteristicsContainer />,
  isLast: true,
});

const General: FC = () => {
  const { t } = useTranslation();

  return (
    <TabContentHeader title={t("report.info")}>
      <TabsLayout>
        <SessionInfo />
        <ElementCharacteristics />
      </TabsLayout>
    </TabContentHeader>
  );
};

export default General;
