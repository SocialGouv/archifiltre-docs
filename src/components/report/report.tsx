import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import SessionInfo from "./session-info/session-info";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import {
  getFirstLevelName,
  getType,
} from "util/files-and-folders/file-and-folders-utils";
import InfoBoxPaper from "../info-boxes/common/info-box-paper";
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
  api: any;
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
  api,
}) => {
  const { t } = useTranslation();

  const firstLevelName = getFirstLevelName(filesAndFolders);

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box>
            <CategoryTitle>{t("report.fileTreeInfo")}</CategoryTitle>
          </Box>
          <Box flexGrow={1}>
            <InfoBoxPaper>
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
            </InfoBoxPaper>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box>
            <CategoryTitle>{t("report.elementInfo")}</CategoryTitle>
          </Box>
          <Box flexGrow={1}>
            <InfoBoxPaper>
              <Grid container>
                <Grid item xs={12}>
                  <ElementCharacteristicsContainer api={api} />
                </Grid>
              </Grid>
            </InfoBoxPaper>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Report;
