import CategoryTitle from "components/common/category-title";
import TabContentHeader from "components/workspace/tabs/tab-content-header";
import TabsLayout from "components/workspace/tabs/tabs-layout";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import SessionInfo from "./session-info/session-info";
import { getFirstLevelName } from "util/files-and-folders/file-and-folders-utils";
import ElementCharacteristicsContainer from "../info-boxes/element-characteristics/element-characteristics-container";

type ReportProps = {
  filesAndFolders: FilesAndFoldersMap;
  sessionName: string;
  setSessionName: (newSessionName: string) => void;
  nbFiles: number;
  nbFolders: number;
  volume: number;
  oldestFileTimestamp: number;
  newestFileTimestamp: number;
};

const Report: FC<ReportProps> = ({
  filesAndFolders,
  sessionName,
  setSessionName,
  nbFiles,
  nbFolders,
  volume,
  oldestFileTimestamp,
  newestFileTimestamp,
}) => {
  const { t } = useTranslation();

  const firstLevelName = getFirstLevelName(filesAndFolders);

  const components = [
    {
      title: <CategoryTitle>{t("report.fileTree")}</CategoryTitle>,
      content: (
        <SessionInfo
          sessionName={sessionName}
          onChangeSessionName={setSessionName}
          nbFolders={nbFolders}
          nbFiles={nbFiles}
          volume={volume}
          oldestFileTimestamp={oldestFileTimestamp}
          newestFileTimestamp={newestFileTimestamp}
          firstLevelName={firstLevelName}
        />
      ),
    },
    {
      title: <CategoryTitle>{t("report.element")}</CategoryTitle>,
      content: <ElementCharacteristicsContainer />,
    },
  ];

  return (
    <TabContentHeader title={t("report.info")}>
      <TabsLayout components={components} />
    </TabContentHeader>
  );
};

export default Report;
