import React, { useCallback, useMemo } from "react";

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
  exportToAuditReport
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
            <SaveButton api={api} exportToJson={exportToJson} />
          </TextAlignCenter>
        </ButtonCell>
      )}

      {shouldDisplayActions && (
        <ButtonCell>
          <ExportDropdown
            api={api}
            areHashesReady={areHashesReady}
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
            <ReinitButton api={api} />
          </TextAlignCenter>
        </ButtonCell>
      )}
    </HeaderLine>
  );
};

export default function DashBoardApiToProps({
  api,
  areHashesReady,
  exportToCsv,
  exportToResip,
  exportToMets,
  exportToJson,
  exportToAuditReport,
  rootFilesAndFoldersMetadata,
  filesAndFolders
}) {
  const {
    loading_state: { isFinished, isInError, isStarted },
    database
  } = api;
  const finished = isFinished();
  const error = isInError();

  const nbFiles = useMemo(() => getFileCount(filesAndFolders), [
    filesAndFolders
  ]);
  const nbFolders = useMemo(() => getFoldersCount(filesAndFolders), [
    filesAndFolders
  ]);
  const volume = rootFilesAndFoldersMetadata.childrenTotalSize;

  const onChangeSessionName = useCallback(
    newSessionName => {
      if (newSessionName.length > 0) {
        database.setSessionName(newSessionName);
        api.undo.commit();
      }
    },
    [api.undo, database]
  );

  return (
    <DashBoard
      api={api}
      areHashesReady={areHashesReady}
      started={isStarted()}
      finished={finished}
      error={error}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      sessionName={database.getSessionName()}
      onChangeSessionName={onChangeSessionName}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
      exportToJson={exportToJson}
      exportToAuditReport={exportToAuditReport}
    />
  );
}
