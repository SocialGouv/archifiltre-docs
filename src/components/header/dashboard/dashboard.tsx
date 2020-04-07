import React, { FC, useMemo } from "react";

import SaveButton, { ExportToJson } from "components/buttons/save-button";
import ReinitButton, { ResetWorkspace } from "components/buttons/reinit-button";
import TextAlignCenter from "components/common/text-align-center";
import UndoRedo from "components/header/dashboard/undo-redo-button";
import { FilesAndFoldersMetadata } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getFileCount,
  getFoldersCount,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFoldersMap } from "../../../reducers/files-and-folders/files-and-folders-types";
import { SearchButton } from "../../buttons/search-button";
import {
  ExportToAuditReport,
  ExportToCsv,
  ExportToMets,
  ExportToResip,
} from "../../common/export-types";
import ExportButton from "./export-button";
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

export const SmallButtonCell = styled.div`
  min-width: 3em;
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
        <SmallButtonCell>
          <TextAlignCenter>
            <SearchButton />
          </TextAlignCenter>
        </SmallButtonCell>
      )}

      {shouldDisplayNavigationArrows && (
        <>
          <TextAlignCenter>
            <SmallButtonCell>
              <UndoRedo isVisible={true} api={api} isUndo={true} />
            </SmallButtonCell>
          </TextAlignCenter>
          <TextAlignCenter>
            <SmallButtonCell>
              <UndoRedo isVisible={true} api={api} isUndo={false} />
            </SmallButtonCell>
          </TextAlignCenter>
        </>
      )}

      {shouldDisplayActions && (
        <SmallButtonCell>
          <TextAlignCenter>
            <SaveButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToJson={exportToJson}
            />
          </TextAlignCenter>
        </SmallButtonCell>
      )}

      {shouldDisplayActions && (
        <SmallButtonCell>
          <TextAlignCenter>
            <ExportButton
              areHashesReady={areHashesReady}
              exportToAuditReport={exportToAuditReport}
              exportToMets={exportToMets}
              exportToResip={exportToResip}
              exportToCsv={exportToCsv}
            />
          </TextAlignCenter>
        </SmallButtonCell>
      )}
      {shouldDisplayPreviousSession && (
        <SmallButtonCell>
          <LoadPreviousSessionButton
            reloadPreviousSession={reloadPreviousSession}
          />
        </SmallButtonCell>
      )}
      <SmallButtonCell>
        <TextAlignCenter>
          <SettingsButton />
        </TextAlignCenter>
      </SmallButtonCell>
      {shouldDisplayReset && (
        <SmallButtonCell>
          <TextAlignCenter>
            <ReinitButton resetWorkspace={resetWorkspace} />
          </TextAlignCenter>
        </SmallButtonCell>
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
