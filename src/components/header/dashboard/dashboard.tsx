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
import LoadPreviousSessionButton from "./load-previous-session-button";
import SettingsButton from "./settings-button";
import { useLoadingStep } from "../../../reducers/loading-state/loading-state-selectors";
import { LoadingStep } from "../../../reducers/loading-state/loading-state-types";

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
  exportToCsv: ExportToCsv;
  exportToResip: ExportToResip;
  exportToMets: ExportToMets;
  exportToJson: ExportToJson;
  exportToAuditReport: ExportToAuditReport;
  resetWorkspace: ResetWorkspace;
  reloadPreviousSession: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const DashBoard: FC<DashboardProps> = ({
  areHashesReady,
  started,
  finished,
  error,
  hasPreviousSession,
  originalPath,
  sessionName,
  exportToCsv,
  exportToResip,
  exportToMets,
  exportToJson,
  exportToAuditReport,
  resetWorkspace,
  reloadPreviousSession,
  undo,
  redo,
  canUndo,
  canRedo,
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
            <UndoRedo
              isVisible={true}
              undo={undo}
              redo={redo}
              isUndo={true}
              isActive={canUndo}
            />
          </Box>
        )}
        {shouldDisplayNavigationArrows && (
          <Box pl={1}>
            <UndoRedo
              isVisible={true}
              undo={undo}
              redo={redo}
              isUndo={false}
              isActive={canRedo}
            />
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

export default DashBoard;
