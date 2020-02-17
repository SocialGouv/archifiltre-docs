import React, { FC, useCallback } from "react";
import { FaFile, FaFolder, FaPen } from "react-icons/fa";
import { RIEInput } from "riek";
import styled from "styled-components";
import { octet2HumanReadableFormat } from "../../main-space/ruler";

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

const SESSION_NAME_PROP = "new_session_name";

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
  volume
}) => {
  const sessionNameChanged = useCallback(
    rieInput => {
      onChangeSessionName(rieInput[SESSION_NAME_PROP]);
    },
    [onChangeSessionName]
  );
  return (
    <SessionInfoCell>
      <SessionNameCell className="edit_hover_container">
        <RIEInput
          value={sessionName}
          change={sessionNameChanged}
          propName={SESSION_NAME_PROP}
          className="session_name editable_text"
          validate={s => s.replace(/\s/g, "").length > 0}
        />
        &ensp;
        <FaPen className="edit_hover_pencil" style={{ opacity: "0.3" }} />
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
