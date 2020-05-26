import React from "react";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import SessionInfo from "./session-info/session-info";
import ElementCharacteristics from "./element-characteristics/element-characteristics";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import InfoBoxPaper from "../info-boxes/common/info-box-paper";
import Box from "@material-ui/core/Box";

const CategoryTitle = styled.h4`
  margin: 5px 0;
  font-weight: bold;
`;

const Report = ({
  currentFilesAndFolders,
  currentFileHash,
  currentFileAlias,
  filesAndFoldersId,
  filesAndFoldersMetadata,
  onChangeAlias,
  isFocused,
  isLocked,
  sessionName,
  setSessionName,
  nbFiles,
  nbFolders,
  volume,
  oldestFileTimestamp,
  newestFileTimestamp,
}) => {
  const { t } = useTranslation();

  const isActive = isFocused || isLocked;

  const isFolder = currentFilesAndFolders
    ? !isFile(currentFilesAndFolders)
    : false;

  const elementSize = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].childrenTotalSize
    : 0;

  const maxLastModifiedTimestamp = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].maxLastModified
    : 0;

  const minLastModifiedTimestamp = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].minLastModified
    : 0;

  const medianLastModifiedTimestamp = currentFilesAndFolders
    ? filesAndFoldersMetadata[filesAndFoldersId].medianLastModified
    : 0;

  const type = getType(currentFilesAndFolders);

  const nodeName = isActive ? currentFilesAndFolders.name : "";

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
                    nbFolders={nbFiles}
                    nbFiles={nbFolders}
                    volume={volume}
                    oldestFileTimestamp={oldestFileTimestamp}
                    newestFileTimestamp={newestFileTimestamp}
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
                  <ElementCharacteristics
                    elementName={nodeName}
                    elementAlias={currentFileAlias}
                    elementSize={elementSize}
                    hash={currentFileHash}
                    isFolder={isFolder}
                    onElementNameChange={onChangeAlias}
                    minLastModifiedTimestamp={minLastModifiedTimestamp}
                    maxLastModifiedTimestamp={maxLastModifiedTimestamp}
                    medianLastModifiedTimestamp={medianLastModifiedTimestamp}
                    type={type}
                  />
                </Grid>
              </Grid>
            </InfoBoxPaper>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default function ReportApiToProps({
  originalPath,
  currentFileHash,
  currentFileAlias,
  filesAndFolders,
  filesAndFoldersId,
  filesAndFoldersMetadata,
  isLocked,
  updateAlias,
  fillColor,
  sessionName,
  setSessionName,
  nbFiles,
  nbFolders,
  volume,
  oldestFileTimestamp,
  newestFileTimestamp,
}) {
  const isFocused = filesAndFoldersId !== "";

  const isActive = isFocused || isLocked;

  const currentFilesAndFolders = isActive
    ? filesAndFolders[filesAndFoldersId]
    : null;

  return (
    <Report
      currentFilesAndFolders={currentFilesAndFolders}
      currentFileHash={currentFileHash}
      currentFileAlias={currentFileAlias}
      filesAndFoldersId={filesAndFoldersId}
      filesAndFolders={filesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      originalPath={originalPath}
      isFocused={isFocused}
      isLocked={isLocked}
      fillColor={fillColor}
      onChangeAlias={updateAlias}
      sessionName={sessionName}
      setSessionName={setSessionName}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      oldestFileTimestamp={oldestFileTimestamp}
      newestFileTimestamp={newestFileTimestamp}
    />
  );
}
