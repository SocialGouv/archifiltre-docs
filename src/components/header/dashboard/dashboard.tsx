import React, { FC, useMemo } from "react";

import SaveButton, { ExportToJson } from "components/buttons/save-button";
import ReinitButton, { ResetWorkspace } from "components/buttons/reinit-button";
import TextAlignCenter from "components/common/text-align-center";
import UndoRedo from "components/header/dashboard/undo-redo";
import { FilesAndFoldersMetadata } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getFileCount,
  getFoldersCount,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFoldersMap } from "../../../reducers/files-and-folders/files-and-folders-types";
import { ExportToAuditReport } from "../../buttons/audit-report-button";
import { ExportToCsv } from "../../buttons/csv-button";
import { ExportToMets } from "../../buttons/mets-button";
import { ExportToResip } from "../../buttons/resip-button";
import ExportDropdown from "../export-dropdown";
import SessionInfo from "./session-info";
import styled from "styled-components";
import ArchifiltreLogo from "../archifiltre-logo";
import LoadPreviousSessionButton from "../../buttons/load-previous-session-button";
import SettingsButton from "./settings-button";

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

const TextAlignRight = styled.div`
  text-align: right;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`;

interface DashboardProps {
  areHashesReady: boolean;
  started: boolean;
  finished: boolean;
  error: boolean;
  hasPreviousSession: boolean;
  originalPath: string;
  sessionName: string;
  onChangeSessionName: (newName: string) => void;
  nbFolders: number;
  nbFiles: number;
  volume: number;
  api: any;
  exportToCsv: ExportToCsv;
  exportToResip: ExportToResip;
  exportToMets: ExportToMets;
  exportToJson: ExportToJson;
  exportToAuditReport: ExportToAuditReport;
  resetWorkspace: ResetWorkspace;
  reloadPreviousSession: () => void;
}

interface DashbordApiToPropsProps {
  api: any;
  areHashesReady: boolean;
  originalPath: string;
  hasPreviousSession: boolean;
  sessionName: string;
  exportToCsv: ExportToCsv;
  exportToResip: ExportToResip;
  exportToMets: ExportToMets;
  exportToJson: ExportToJson;
  exportToAuditReport: ExportToAuditReport;
  resetWorkspace: ResetWorkspace;
  reloadPreviousSession: () => void;
  rootFilesAndFoldersMetadata: FilesAndFoldersMetadata;
  filesAndFolders: FilesAndFoldersMap;
  setSessionName: (newName: string) => void;
}

const DashBoard: FC<DashboardProps> = ({
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
  const shouldDisplayActions = started && finished && !error;
  const shouldDisplayReset = started && finished;
  const shouldDisplayPreviousSession =
    !started && !finished && !error && hasPreviousSession;
  const shouldDisplayNavigationArrows = started === finished && !error;

  return (
    <HeaderLine>
      <div>
        <ArchifiltreLogo />
      </div>

      <Spacer />
      <div>
        {shouldDisplayNavigationArrows && (
          <UndoRedo isVisible={true} api={api} />
        )}
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
        <SettingsButton />
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

const DashBoardApiToProps: FC<DashbordApiToPropsProps> = ({
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
}) => {
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
};

export default DashBoardApiToProps;
