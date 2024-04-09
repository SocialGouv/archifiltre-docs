import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { IoIosCloudOutline } from "react-icons/all";

import { getCO2ByFileSize } from "../../../../../utils";
import { EditableField } from "../../../../common/editable-field";
import { HelpTooltip } from "../../../../common/help-tooltip";
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
  <Box display="flex">
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
        <WorkspaceBoundaryDates oldestFileTimestamp={oldestFileTimestamp} newestFileTimestamp={newestFileTimestamp} />
      </Box>
    </Box>
    <Box marginLeft={"auto"}>
      <Box display="flex" flexDirection="column" justifyContent="space-between" textAlign="center">
        <Box>
          <IoIosCloudOutline size={50} />
        </Box>
        <Box>
          <Typography variant="h5">
            {getCO2ByFileSize(volume)}{" "}
            <HelpTooltip
              tooltipText={
                "Ce poids est calculé à partir de l’indicateur de la Base IMPACTS® Numérique de l’ADEME : 0,0116 kg CO2eq/an pour 1Go stocké"
              }
            />
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);
