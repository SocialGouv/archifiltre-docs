import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { EditableField } from "../../../../common/editable-field";
import { SessionElementsDetails } from "./session-elements-details";
import { WorkspaceBoundaryDates } from "./workspace-boundary-dates";

export interface SessionInfoProps {
  archivesCount: number;
  filesCount: number;
  firstLevelName: string;
  foldersCount: number;
  newestFileTimestamp: number;
  oldestFileTimestamp: number;
  onChangeSessionName: (name: string) => void;
  sessionName: string;
  volume: number;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({
  sessionName,
  onChangeSessionName,
  foldersCount,
  archivesCount,
  filesCount,
  volume,
  newestFileTimestamp,
  oldestFileTimestamp,
  firstLevelName,
}) => (
  <Box display="flex" flexDirection="column" justifyContent="space-between">
    <Box marginY={0.5}>
      <Box>
        <EditableField
          trimValue={true}
          value={firstLevelName === sessionName ? firstLevelName : sessionName}
          onChange={onChangeSessionName}
          selectTextOnFocus={true}
        />
      </Box>
      {firstLevelName !== sessionName && (
        <Box>
          <Typography variant="subtitle2">({firstLevelName})</Typography>
        </Box>
      )}
    </Box>
    <Box marginY={0.5}>
      <SessionElementsDetails
        filesCount={filesCount}
        foldersCount={foldersCount}
        archivesCount={archivesCount}
        volume={volume}
      />
    </Box>
    <Box marginY={0.5}>
      <WorkspaceBoundaryDates
        oldestFileTimestamp={oldestFileTimestamp}
        newestFileTimestamp={newestFileTimestamp}
      />
    </Box>
  </Box>
);
