import type { VoidFunction } from "@common/utils/function";
import Box from "@material-ui/core/Box";
import React from "react";
import styled from "styled-components";

import type { ExportToJson } from "../../exporters/json/json-exporter";
import { Logo } from "../common/Logo";
import { Version } from "../common/version";
import { TabsHeader } from "../main-space/workspace/tabs/tabs-header";
import { MetadataModalButton } from "../modals/MetadataModal/MetadataModalButton";
import { ExportButton } from "./export-button";
import { SaveButton } from "./save-button";
import { SearchButton } from "./search-button";
import { useTabsState } from "./tabs-context";
import { UndoRedoButton } from "./undo-redo-button";
import { UserButton } from "./user-button";

const HeaderLine = styled.div`
  width: 100%;
`;

export interface HeaderActionsProps {
  canRedo: boolean;
  canUndo: boolean;
  exportToJson: ExportToJson;
  originalPath: string;
  redo: () => void;
  resetWorkspace: VoidFunction;
  sessionName: string;
  undo: () => void;
}

export const Header: React.FC<HeaderActionsProps> = ({
  originalPath,
  sessionName,
  exportToJson,
  resetWorkspace,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  const { tabIndex, setTabIndex } = useTabsState();

  return (
    <HeaderLine>
      <Box display="flex">
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          flexDirection="column"
        >
          <Logo height={30} />
          <Version />
        </Box>
        <Box flexGrow={1} />
        <>
          <Box>
            <TabsHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
          </Box>
          <Box flexGrow={1} />
        </>
        <Box>
          <MetadataModalButton />
        </Box>
        <Box>
          <SearchButton />
        </Box>
        <Box pl={1}>
          <UndoRedoButton
            isVisible={true}
            undo={undo}
            redo={redo}
            isUndo={true}
            isActive={canUndo}
          />
        </Box>
        <Box pl={1}>
          <UndoRedoButton
            isVisible={true}
            undo={undo}
            redo={redo}
            isUndo={false}
            isActive={canRedo}
          />
        </Box>
        <Box pl={1}>
          <SaveButton
            originalPath={originalPath}
            sessionName={sessionName}
            exportToJson={exportToJson}
          />
        </Box>
        <Box pl={1}>
          <ExportButton />
        </Box>
        <Box pl={1}>
          <UserButton resetWorkspace={resetWorkspace} />
        </Box>
      </Box>
    </HeaderLine>
  );
};
