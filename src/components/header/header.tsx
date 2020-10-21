import Box from "@material-ui/core/Box";
import UserButton from "components/header/user-button";
import { useTabsState } from "./tabs-context";
import React, { FC } from "react";
import TabsHeader from "components/main-space/workspace/tabs/tabs-header";
import SaveButton, { ExportToJson } from "./save-button";
import UndoRedo from "./undo-redo-button";
import { SearchButton } from "./search-button";
import ExportButton from "./export-button";
import styled from "styled-components";
import logo from "../../../static/imgs/logo.png";

const HeaderLine = styled.div`
  width: 100%;
`;

export type ResetWorkspace = () => void;

type HeaderActionsProps = {
  originalPath: string;
  sessionName: string;
  exportToJson: ExportToJson;
  resetWorkspace: ResetWorkspace;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const Header: FC<HeaderActionsProps> = ({
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
        <Box display="flex" alignItems="center">
          <img src={logo} alt="Logo archifiltre" height={30} />
        </Box>
        <Box flexGrow={1} />
        <>
          <Box>
            <TabsHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
          </Box>
          <Box flexGrow={1} />
        </>
        <Box>
          <SearchButton />
        </Box>
        <Box pl={1}>
          <UndoRedo
            isVisible={true}
            undo={undo}
            redo={redo}
            isUndo={true}
            isActive={canUndo}
          />
        </Box>
        <Box pl={1}>
          <UndoRedo
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

export default Header;
