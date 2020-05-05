import React, { FC } from "react";
import { FaFile, FaFolder } from "react-icons/fa";
import styled from "styled-components";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import EditableField from "../../fields/editable-field";

const SessionInfoCell = styled.div`
  line-height: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SessionNameCell = styled.div`
  margin: 0.2em -0.8em;
  padding: 0.2em 0.8em;
`;

interface SessionInfoProps {
  sessionName: string;
  onChangeSessionName: (name: string) => void;
  nbFolders: number;
  nbFiles: number;
  volume: number;
}

const SessionInfo: FC<SessionInfoProps> = ({
  sessionName,
  onChangeSessionName,
  nbFolders,
  nbFiles,
  volume,
}) => {
  return (
    <SessionInfoCell>
      <SessionNameCell>
        <EditableField
          trimValue={true}
          value={sessionName}
          onChange={onChangeSessionName}
          selectTextOnFocus={true}
        />
      </SessionNameCell>
      <b>
        {nbFolders} <FaFolder style={{ verticalAlign: "bottom" }} />
        &ensp;&ensp;
        {nbFiles} <FaFile style={{ verticalAlign: "bottom" }} />
        &ensp;&ensp;
        {octet2HumanReadableFormat(volume)}
      </b>
    </SessionInfoCell>
  );
};

export default SessionInfo;
