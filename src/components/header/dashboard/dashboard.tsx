import Box from "@material-ui/core/Box";
import React, { FC } from "react";
import SaveButton, { ExportToJson } from "./save-button";
import ReinitButton, { ResetWorkspace } from "./reinit-button";
import UndoRedo from "components/header/dashboard/undo-redo-button";
import { SearchButton } from "./search-button";
import {
  ExportToAuditReport,
  ExportToCsv,
  ExportToMets,
  ExportToResip,
} from "../../common/export-types";
import ExportButton from "./export-button";
import styled from "styled-components";
import ArchifiltreLogo from "../archifiltre-logo";
import LoadPreviousSessionButton from "../../buttons/load-previous-session-button";
import SettingsButton from "./settings-button";

const HeaderLine = styled.div`
  width: 100%;
`;

interface DashboardProps {
  areHashesReady: boolean;
  started: boolean;
  finished: boolean;
  error: boolean;
  hasPreviousSession: boolean;
  originalPath: string;
  sessionName: string;
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
}

const DashBoard: FC<DashboardProps> = ({
  areHashesReady,
  started,
  finished,
  error,
  hasPreviousSession,
  originalPath,
  sessionName,
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
      <Box display="flex">
        <Box>
          <ArchifiltreLogo />
        </Box>
        <Box flexGrow={1} />
        {shouldDisplayActions && (
          <Box>
            <SearchButton />
          </Box>
        )}
        {shouldDisplayNavigationArrows && (
          <Box pl={1}>
            <UndoRedo isVisible={true} api={api} isUndo={true} />
          </Box>
        )}
        {shouldDisplayNavigationArrows && (
          <Box pl={1}>
            <UndoRedo isVisible={true} api={api} isUndo={false} />
          </Box>
        )}
        {shouldDisplayActions && (
          <Box pl={1}>
            <SaveButton
              originalPath={originalPath}
              sessionName={sessionName}
              exportToJson={exportToJson}
            />
          </Box>
        )}
        {shouldDisplayActions && (
          <Box pl={1}>
            <ExportButton
              areHashesReady={areHashesReady}
              exportToAuditReport={exportToAuditReport}
              exportToMets={exportToMets}
              exportToResip={exportToResip}
              exportToCsv={exportToCsv}
            />
          </Box>
        )}
        {shouldDisplayPreviousSession && (
          <Box pl={1}>
            <LoadPreviousSessionButton
              reloadPreviousSession={reloadPreviousSession}
            />
          </Box>
        )}
        <Box pl={1}>
          <SettingsButton />
        </Box>
        {shouldDisplayReset && (
          <Box pl={1}>
            <ReinitButton resetWorkspace={resetWorkspace} />
          </Box>
        )}
      </Box>
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
}) => {
  const {
    loading_state: { isFinished, isInError, isStarted },
  } = api;
  const finished = isFinished();
  const error = isInError();
  const started = isStarted();

  return (
    <DashBoard
      api={api}
      areHashesReady={areHashesReady}
      started={started}
      finished={finished}
      error={error}
      hasPreviousSession={hasPreviousSession}
      sessionName={sessionName}
      originalPath={originalPath}
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
