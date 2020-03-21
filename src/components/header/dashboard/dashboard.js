import React, { useMemo } from "react";

import SaveButton from "components/buttons/save-button";
import ReinitButton from "components/buttons/reinit-button.tsx";
import TextAlignCenter from "components/common/text-align-center";
import CtrlZ from "components/header/dashboard/ctrl-z";
import {
  getFileCount,
  getFoldersCount,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import ExportDropdown from "../export-dropdown";
import SessionInfo from "./session-info";
import LanguagePicker from "./language";
import styled from "styled-components";
import ArchifiltreLogo from "../archifiltre-logo";
import LoadPreviousSessionButton from "../../buttons/load-previous-session-button";

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
  min-width: 4em;
`;

const TextAlignRight = styled.div`
  text-align: right;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const DashBoard = ({
  areHashesReady,
  started,
  finished,
  error,
  hasPreviousSession,
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
  resetWorkspace,
  reloadPreviousSession,
}) => {
  const shouldDisplayActions =
    started === true && finished === true && error === false;

  const shouldDisplayReset = started === true && finished === true;
  const shouldDisplayPreviousSession =
    started === false &&
    finished === false &&
    error === false &&
    hasPreviousSession === true;
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
          <TextAlignRight>
            <SaveButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToJson={exportToJson}
            />
          </TextAlignRight>
        </ButtonCell>
      )}

      {shouldDisplayActions && (
        <ButtonCell>
          <FlexCenter>
            <ExportDropdown
              areHashesReady={areHashesReady}
              originalPath={originalPath}
              sessionName={sessionName}
              exportToAuditReport={exportToAuditReport}
              exportToMets={exportToMets}
              exportToResip={exportToResip}
              exportToCsv={exportToCsv}
            />
          </FlexCenter>
        </ButtonCell>
      )}
      {shouldDisplayPreviousSession && (
        <ButtonCell>
          <LoadPreviousSessionButton
            reloadPreviousSession={reloadPreviousSession}
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
  hasPreviousSession,
  sessionName,
  exportToCsv,
  exportToResip,
  exportToMets,
  exportToJson,
  exportToAuditReport,
  resetWorkspace,
  reloadPreviousSession,
  rootFilesAndFoldersMetadata,
  filesAndFolders,
  setSessionName,
}) {
  const {
    loading_state: { isFinished, isInError, isStarted },
  } = api;
  const finished = isFinished();
  const error = isInError();
  const started = isStarted();

  const nbFiles = useMemo(() => getFileCount(filesAndFolders), [
    filesAndFolders,
  ]);
  const nbFolders = useMemo(() => getFoldersCount(filesAndFolders), [
    filesAndFolders,
  ]);
  const volume = rootFilesAndFoldersMetadata.childrenTotalSize;

  return (
    <DashBoard
      api={api}
      areHashesReady={areHashesReady}
      started={started}
      finished={finished}
      error={error}
      hasPreviousSession={hasPreviousSession}
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
      reloadPreviousSession={reloadPreviousSession}
    />
  );
}
