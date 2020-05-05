import React from "react";

import LastModifiedReporter from "components/report/last-modified-reporter";

import * as Color from "util/color/color-util";

import { shell } from "electron";
import path from "path";
import Icon, {
  FOLDER_ICON,
  PAGE_ICON,
  PAGE_MULTIPLE_ICON,
} from "../common/icon";
import ClickableIcon from "../common/clickable-icon";
import ReactTooltip from "react-tooltip";
import { useTranslation } from "react-i18next";
import {
  getDisplayName,
  getType,
} from "util/files-and-folders/file-and-folders-utils";
import { FaInfoCircle } from "react-icons/fa";
import Grid from "@material-ui/core/Grid";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import EditableField from "../fields/editable-field";
import SessionInfo from "./session-info/session-info";

const CategoryTitle = styled.h3`
  margin: 5px 0;
`;

const StyledGrid = styled(Grid)`
  padding: 10px;
`;

const infoCellStyle = {
  fontSize: "0.8em",
};

const ElementNameCell = styled.div`
  margin: 0.2em -0.8em;
  padding: 0.2em 0.8em;
`;

const overflowEllipsisStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};

const ElementIcon = ({
  placeholder,
  isFolder,
  fillColor,
  filesAndFoldersId,
  onClick,
}) => {
  const icon = isFolder ? FOLDER_ICON : PAGE_ICON;

  if (placeholder) {
    return <Icon icon={PAGE_MULTIPLE_ICON} color={Color.placeholder()} />;
  }

  const color = fillColor(filesAndFoldersId);
  return <ClickableIcon icon={icon} color={color} onClick={onClick} />;
};

const Name = ({
  displayName = "",
  placeholder,
  bracketName = "",
  onChangeAlias,
}) => {
  const { t } = useTranslation();
  if (placeholder) {
    return (
      <div style={{ fontWeight: "bold" }}>
        {t("report.fileOrFolderNamePlaceholder")}
      </div>
    );
  } else {
    return (
      <ElementNameCell>
        <EditableField
          multiline={true}
          trimValue={true}
          selectTextOnFocus={true}
          value={displayName || bracketName}
          onChange={onChangeAlias}
        />
      </ElementNameCell>
    );
  }
};

const RealName = (props) => {
  const { bracketName } = props;
  const placeholder = props.placeholder;
  const { t } = useTranslation();
  if (placeholder) {
    return (
      <div style={{ fontStyle: "italic" }}>
        ({t("report.fileOrFolderRealNamePlaceholder")})
      </div>
    );
  } else {
    return (
      <div
        style={{
          fontStyle: "italic",
          visibility: bracketName === "" ? "hidden" : "",
        }}
      >
        ({bracketName})
      </div>
    );
  }
};

const NameCell = ({
  placeholder,
  bracketName,
  nodeName,
  displayName,
  filesAndFoldersId,
  isFolder,
  fillColor,
  originalPath,
  onChangeAlias,
}) => (
  <Grid container>
    <Grid item>
      <ElementIcon
        placeholder={placeholder}
        isFolder={isFolder}
        fillColor={fillColor}
        filesAndFoldersId={filesAndFoldersId}
        onClick={() => {
          const itemPath = path.join(originalPath, "..", filesAndFoldersId);
          shell.openItem(itemPath);
        }}
      />
    </Grid>
    <Grid item>
      <Grid item>
        <Grid item>
          <Name
            placeholder={placeholder}
            onChangeAlias={onChangeAlias}
            filesAndFoldersId={filesAndFoldersId}
            displayName={displayName}
            bracketName={bracketName}
            nodeName={nodeName}
          />
        </Grid>
        <Grid item xs={12}>
          {" "}
          <RealName placeholder={placeholder} bracketName={bracketName} />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

const InfoCell = ({
  currentFileHash,
  placeholder = false,
  filesAndFolders,
  filesAndFoldersId,
  filesAndFoldersMetadata,
}) => {
  const { t } = useTranslation();
  const currentFilesAndFolders = filesAndFolders[filesAndFoldersId];
  const hashLabel =
    currentFileHash === undefined || placeholder ? "..." : currentFileHash;
  const sizeLabel = placeholder
    ? "..."
    : octet2HumanReadableFormat(
        filesAndFoldersMetadata[filesAndFoldersId].childrenTotalSize
      );
  const isFolder = currentFilesAndFolders
    ? currentFilesAndFolders.children.length > 0
    : true;
  const hashExplanationText = isFolder
    ? t("report.folderHashExplanation")
    : t("report.fileHashExplanation");
  const typeLabel = placeholder ? "..." : getType(currentFilesAndFolders);

  return (
    <div style={infoCellStyle}>
      <div>
        <b>{t("report.size")} :</b> {sizeLabel}
      </div>
      <div style={overflowEllipsisStyle}>
        <b>
          {t("report.hash")}&nbsp;
          <span data-tip={hashExplanationText} data-for="hash-explanation">
            <FaInfoCircle style={{ verticalAlign: "text-bottom" }} />
          </span>
          &nbsp;:&nbsp;
        </b>
        <span>{hashLabel}</span>
        <ReactTooltip place={"bottom"} id="hash-explanation" />
      </div>
      <div style={overflowEllipsisStyle}>
        <b>{t("report.type")} :</b> {typeLabel}
      </div>
      <br />
      <LastModifiedReporter
        filesAndFoldersId={filesAndFoldersId}
        placeholder={placeholder}
        filesAndFoldersMetadata={filesAndFoldersMetadata}
      />
    </div>
  );
};

const Report = ({
  currentFilesAndFolders,
  currentFileHash,
  currentFileAlias,
  filesAndFoldersId,
  filesAndFolders,
  filesAndFoldersMetadata,
  originalPath,
  onChangeAlias,
  fillColor,
  isFocused,
  isLocked,
  sessionName,
  setSessionName,
  nbFiles,
  nbFolders,
  volume,
}) => {
  const { t } = useTranslation();

  const isActive = isFocused || isLocked;

  let children = [];
  let nodeName = "";
  let displayName = "";
  let bracketName = "";
  let isFolder = false;

  if (isActive) {
    children = currentFilesAndFolders.children;
    nodeName = currentFilesAndFolders.name;
    displayName = getDisplayName(nodeName, currentFileAlias);
    bracketName = currentFileAlias === "" ? "" : nodeName;
    isFolder = children.length > 0;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <CategoryTitle>{t("report.fileTreeInfo")}</CategoryTitle>
        <Paper>
          <StyledGrid container>
            <Grid item xs={12}>
              <SessionInfo
                sessionName={sessionName}
                onChangeSessionName={setSessionName}
                nbFolders={nbFiles}
                nbFiles={nbFolders}
                volume={volume}
              />
            </Grid>
          </StyledGrid>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <CategoryTitle>{t("report.elementInfo")}</CategoryTitle>
        <Paper>
          <StyledGrid container>
            <Grid item xs={6}>
              <NameCell
                placeholder={!isActive}
                filesAndFoldersId={filesAndFoldersId}
                nodeName={nodeName}
                displayName={displayName}
                bracketName={bracketName}
                fillColor={fillColor}
                isFolder={isFolder}
                onChangeAlias={onChangeAlias}
                originalPath={originalPath}
              />
            </Grid>
            <Grid item xs={6}>
              <InfoCell
                currentFileHash={currentFileHash}
                filesAndFolders={filesAndFolders}
                filesAndFoldersId={filesAndFoldersId}
                filesAndFoldersMetadata={filesAndFoldersMetadata}
                placeholder={!isActive}
              />
            </Grid>
          </StyledGrid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default function ReportApiToProps({
  originalPath,
  currentFileHash,
  currentFileAlias,
  filesAndFolders,
  filesAndFoldersId,
  filesAndFoldersMetadata,
  isLocked,
  updateAlias,
  fillColor,
  sessionName,
  setSessionName,
  nbFiles,
  nbFolders,
  volume,
}) {
  const isFocused = filesAndFoldersId !== "";

  const isActive = isFocused || isLocked;

  const currentFilesAndFolders = isActive
    ? filesAndFolders[filesAndFoldersId]
    : {};

  return (
    <Report
      currentFilesAndFolders={currentFilesAndFolders}
      currentFileHash={currentFileHash}
      currentFileAlias={currentFileAlias}
      filesAndFoldersId={filesAndFoldersId}
      filesAndFolders={filesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      originalPath={originalPath}
      isFocused={isFocused}
      isLocked={isLocked}
      fillColor={fillColor}
      onChangeAlias={updateAlias}
      sessionName={sessionName}
      setSessionName={setSessionName}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
    />
  );
}
