import { Divider } from "@material-ui/core";
import TabContent from "components/workspace/tab-content";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import SessionInfo from "./session-info/session-info";
import { getFirstLevelName } from "util/files-and-folders/file-and-folders-utils";
import Box from "@material-ui/core/Box";
import CategoryTitle from "../common/category-title";
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

  return (
    <TabContent title={t("report.info")}>
      <Box display="flex" height="100%">
        <Box flex={1}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box>
              <CategoryTitle>{t("report.fileTree")}</CategoryTitle>
            </Box>
            <Box flexGrow={1}>
              <Grid container>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Box padding={2}>
          <Divider orientation="vertical" />
        </Box>
        <Box flex={1}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box>
              <CategoryTitle>{t("report.element")}</CategoryTitle>
            </Box>
            <Box flexGrow={1}>
              <Grid container>
                <Grid item xs={12}>
                  <ElementCharacteristicsContainer />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </TabContent>
  );
};

export default Report;
