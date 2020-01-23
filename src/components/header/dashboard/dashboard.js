import React, { useCallback, useMemo } from "react";

import SaveButton from "components/buttons/save-button";
import ReinitButton from "components/buttons/reinit-button";
import TextAlignCenter from "components/common/text-align-center";
import CtrlZ from "components/header/dashboard/ctrl-z";
import {
  getFileCount,
  getFoldersCount
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import ExportDropdown from "../export-dropdown";
import SessionInfo from "./session-info";

const DashBoard = ({
  areHashesReady,
  started,
  finished,
  error,
  sessionName,
  onChangeSessionName,
  nbFolders,
  nbFiles,
  volume,
  api,
  exportToCsv,
  exportToResip,
  exportToMets,
  exportToJson,
  exportToAuditReport
}) => {
  const shouldDisplayActions =
    started === true && finished === true && error === false;

  const shouldDisplayReset = started === true && finished === true;

  const shouldDisplayNavigationArrows = started === finished && error === false;

  return (
    <div className="grid-x grid-padding-y align-middle">
      <div className="cell small-2">
        {shouldDisplayNavigationArrows && <CtrlZ visible={true} api={api} />}
      </div>

      <div className="cell auto" />

      <div className="cell small-3">
        {shouldDisplayActions && (
          <SessionInfo
            sessionName={sessionName}
            onChangeSessionName={onChangeSessionName}
            nbFolders={nbFolders}
            nbFiles={nbFiles}
            volume={volume}
          />
        )}
      </div>

      <div className="cell auto" />

      <div className="cell small-2">
        {shouldDisplayActions && (
          <TextAlignCenter>
            <SaveButton api={api} exportToJson={exportToJson} />
          </TextAlignCenter>
        )}
      </div>

      <div className="cell small-2">
        {shouldDisplayActions && (
          <ExportDropdown
            api={api}
            areHashesReady={areHashesReady}
            exportToAuditReport={exportToAuditReport}
            exportToMets={exportToMets}
            exportToResip={exportToResip}
            exportToCsv={exportToCsv}
          />
        )}
      </div>
      <div className="cell small-2">
        {shouldDisplayReset && (
          <TextAlignCenter>
            <ReinitButton api={api} />
          </TextAlignCenter>
        )}
      </div>
    </div>
  );
};

export default function DashBoardApiToProps({
  api,
  areHashesReady,
  exportToCsv,
  exportToResip,
  exportToMets,
  exportToJson,
  exportToAuditReport,
  rootFilesAndFoldersMetadata,
  filesAndFolders
}) {
  const {
    loading_state: { isFinished, isInError, isStarted },
    database
  } = api;
  const finished = isFinished();
  const error = isInError();

  const nbFiles = useMemo(() => getFileCount(filesAndFolders), [
    filesAndFolders
  ]);
  const nbFolders = useMemo(() => getFoldersCount(filesAndFolders), [
    filesAndFolders
  ]);
  const volume = rootFilesAndFoldersMetadata.childrenTotalSize;

  const onChangeSessionName = useCallback(
    newSessionName => {
      if (newSessionName.length > 0) {
        database.setSessionName(newSessionName);
        api.undo.commit();
      }
    },
    [api.undo, database]
  );

  return (
    <DashBoard
      api={api}
      areHashesReady={areHashesReady}
      started={isStarted()}
      finished={finished}
      error={error}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      sessionName={database.getSessionName()}
      onChangeSessionName={onChangeSessionName}
      exportToCsv={exportToCsv}
      exportToResip={exportToResip}
      exportToMets={exportToMets}
      exportToJson={exportToJson}
      exportToAuditReport={exportToAuditReport}
    />
  );
}
