import Box from "@material-ui/core/Box";
import { useTabsState } from "./tabs-context";
import OptionsButton from "./options-button";
import React, { FC } from "react";
import TabsHeader from "components/main-space/workspace/tabs/tabs-header";
import SaveButton, { ExportToJson } from "./save-button";
import UndoRedo from "./undo-redo-button";
import { SearchButton } from "./search-button";
import ExportButton from "./export-button";
import styled from "styled-components";
import ArchifiltreLogo from "./archifiltre-logo";
import LoadPreviousSessionButton from "./load-previous-session-button";

const HeaderLine = styled.div`
  width: 100%;
`;

export type ResetWorkspace = () => void;

type HeaderActionsProps = {
  started: boolean;
  finished: boolean;
  error: boolean;
  hasPreviousSession: boolean;
  originalPath: string;
  sessionName: string;
  exportToJson: ExportToJson;
  resetWorkspace: ResetWorkspace;
  reloadPreviousSession: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const Header: FC<HeaderActionsProps> = ({
  started,
  finished,
  error,
  hasPreviousSession,
  originalPath,
  sessionName,
  exportToJson,
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
  const { setAreIciclesDisplayed, tabIndex, setTabIndex } = useTabsState();

  return (
    <HeaderLine>
      <Box display="flex">
        <Box>
          <ArchifiltreLogo />
        </Box>
        <Box flexGrow={1} />
        {shouldDisplayActions && (
          <>
            <Box>
              <TabsHeader
                setAreIciclesDisplayed={setAreIciclesDisplayed}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
              />
            </Box>
            <Box flexGrow={1} />
          </>
        )}
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
            <ExportButton />
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
          <OptionsButton
            resetWorkspace={resetWorkspace}
            shouldDisplayReset={shouldDisplayReset}
          />
        </Box>
      </Box>
    </HeaderLine>
  );
};

export default Header;
