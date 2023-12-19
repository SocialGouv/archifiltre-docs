import type { VoidFunction } from "@common/utils/function";
import Box from "@material-ui/core/Box";
import React from "react";

import type { ExportToJson } from "../../exporters/json/json-exporter";
import { SaveButton } from "../Buttons/SaveButton";
import { Logo } from "../common/Logo";
import { Version } from "../common/version";
import { TabsHeader } from "../main-space/workspace/tabs/tabs-header";
import { MetadataModalButton } from "../modals/MetadataModal/MetadataModalButton";
import { CloseButton } from "./Buttons/close-button";
import { ExportButton } from "./Buttons/export-button";
import { SearchButton } from "./Buttons/search-button";
import { UndoRedoButton } from "./Buttons/undo-redo-button";
import { UserButton } from "./Buttons/user-button";
import { HeaderLine } from "./styledComponents";
import { useTabsState } from "./tabs-context";

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
        <Box>
          <TabsHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
        <Box flexGrow={1} />
        <Box pl={1}>
          <MetadataModalButton />
        </Box>
        <Box pl={1}>
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
          <UserButton />
        </Box>
        <Box pl={1}>
          <CloseButton resetWorkspace={resetWorkspace} />
        </Box>
      </Box>
    </HeaderLine>
  );
};
