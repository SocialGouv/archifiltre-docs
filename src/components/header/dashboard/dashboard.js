import React, { useMemo } from "react";

import SaveButton from "components/buttons/save-button";
import ReinitButton from "components/buttons/reinit-button";
import TextAlignCenter from "components/common/text-align-center";
import CtrlZ from "components/header/dashboard/ctrl-z";
import {
  getFileCount,
  getFoldersCount
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import ExportDropdown from "../export-dropdown";
import SessionInfo from "./session-info";
import LanguagePicker from "./language";
import styled from "styled-components";
import ArchifiltreLogo from "../archifiltre-logo";

const HeaderLine = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.975em;
  align-items: center;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const ButtonCell = styled.div`
  min-width: 9em;
`;

const SmallButtonCell = styled.div`
  min-width: 3em;
`;

const DashBoard = ({
  areHashesReady,
  started,
  finished,
  error,
  originalPath,
  sessionName,
  onChangeSessionName,
  nbFolders,
  nbFiles,
  volume,
  api,
  exportToCsv,
  exportToResip,
  exportToMets,
  exportToJson,
  exportToAuditReport,
  resetWorkspace
}) => {
  const shouldDisplayActions =
    started === true && finished === true && error === false;

  const shouldDisplayReset = started === true && finished === true;

  const shouldDisplayNavigationArrows = started === finished && error === false;

  return (
    <HeaderLine>
      <div>
        <ArchifiltreLogo />
      </div>

      <Spacer />
      <div>
        {shouldDisplayNavigationArrows && <CtrlZ visible={true} api={api} />}
      </div>

      <div>
        {shouldDisplayActions && (
          <SessionInfo
            sessionName={sessionName}
            onChangeSessionName={onChangeSessionName}
            nbFolders={nbFolders}
            nbFiles={nbFiles}
            volume={volume}
          />
        )}
      </div>

      <Spacer />

      {shouldDisplayActions && (
        <ButtonCell>
          <TextAlignCenter>
            <SaveButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToJson={exportToJson}
            />
          </TextAlignCenter>
        </ButtonCell>
      )}

      {shouldDisplayActions && (
        <ButtonCell>
          <ExportDropdown
            areHashesReady={areHashesReady}
            originalPath={originalPath}
            sessionName={sessionName}
            exportToAuditReport={exportToAuditReport}
            exportToMets={exportToMets}
            exportToResip={exportToResip}
            exportToCsv={exportToCsv}
          />
        </ButtonCell>
      )}
      <SmallButtonCell>
        <LanguagePicker />
      </SmallButtonCell>
      {shouldDisplayReset && (
        <ButtonCell>
          <TextAlignCenter>
            <ReinitButton resetWorkspace={resetWorkspace} />
          </TextAlignCenter>
        </ButtonCell>
      )}
    </HeaderLine>
  );
};

export default function DashBoardApiToProps({
  api,
  areHashesReady,
  originalPath,
  sessionName,
  exportToCsv,
  exportToResip,
  exportToMets,
  exportToJson,
  exportToAuditReport,
  resetWorkspace,
  rootFilesAndFoldersMetadata,
  filesAndFolders,
  setSessionName
}) {
  const {
    loading_state: { isFinished, isInError, isStarted }
  } = api;
  const finished = isFinished();
  const error = isInError();
  const started = isStarted();

  const nbFiles = useMemo(() => getFileCount(filesAndFolders), [
    filesAndFolders
  ]);
  const nbFolders = useMemo(() => getFoldersCount(filesAndFolders), [
    filesAndFolders
  ]);
  const volume = rootFilesAndFoldersMetadata.childrenTotalSize;

  return (
    <DashBoard
      api={api}
      areHashesReady={areHashesReady}
      started={started}
      finished={finished}
      error={error}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      sessionName={sessionName}
      originalPath={originalPath}
      onChangeSessionName={setSessionName}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
      exportToJson={exportToJson}
      exportToAuditReport={exportToAuditReport}
      resetWorkspace={resetWorkspace}
    />
  );
}
