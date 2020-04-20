import React, { useState } from "react";

import Icicle from "components/main-space/icicle/icicle-container";
import Report from "components/report/report-container";
import AllTags from "components/tags/all-tags-container";
import NavigationBar from "components/workspace/navigation-bar/navigation-bar-container";
import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import Box from "@material-ui/core/Box";

const workspaceMode = {
  isFileMoveActive: false,
  // eslint-disable-next-line no-unused-vars
  setIsFileMoveActive: (isMoveActive) => {},
};

export const WorkspaceContext = React.createContext(workspaceMode);

const Workspace = ({ api }) => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box
      flexGrow={0}
      flexShrink={0}
      flexBasis="auto"
      style={{ minHeight: "0px", width: "100%" }}
    >
      <Box display="flex" flexDirection="row" flexWrap="wrap" height="100%">
        <Box width={5 / 6} pr="3px" boxSizing="border-box">
          <Report api={api} />
        </Box>
        <Box width={1 / 6} pl="3px" boxSizing="border-box">
          <AllTags api={api} />
        </Box>
      </Box>
    </Box>
    <Box flexGrow={1} flexShrink={1} flexBasis="auto">
      <Box display="flex" flexDirection="column" height="100%">
        <Box flexGrow={0}>
          <NavigationBar api={api} />
        </Box>
        <Box flexGrow={1}>
          <Icicle api={api} />
        </Box>
      </Box>
    </Box>
  </Box>
);

const WorkspaceApiToProps = (props) => {
  const api = props.api;
  const icicle_state = api.icicle_state;

  const childProps = {
    ...props,
    getFfByFfId: props.getFfByFfId,
    display_root: icicle_state.display_root(),
    root_id: ROOT_FF_ID,
    width_by_size: icicle_state.widthBySize(),
  };
  const [isFileMoveActive, setIsFileMoveActive] = useState(false);

  return (
    <WorkspaceContext.Provider
      value={{ isFileMoveActive, setIsFileMoveActive }}
    >
      <Workspace {...childProps} />
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceApiToProps;
