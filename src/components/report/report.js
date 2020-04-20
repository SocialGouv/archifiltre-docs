import React, { useCallback } from "react";

import { RIEInput } from "riek";

import TagsCell from "components/tags/report-cell-tags";
import CommentsCell from "components/report/report-cell-comments";

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
import { FaPen, FaInfoCircle } from "react-icons/fa";
import Grid from "@material-ui/core/Grid";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";

const pad = "1em";

const cellsStyle = {
  borderRadius: "1em",
  padding: "0.6em 1em 0 1em",
  fontSize: "0.8em",
  height: "8em",
  boxSizing: "border-box",
};

const infoCellStyle = {
  fontSize: "0.8em",
};

const marginPaddingCompensate = {
  padding: "0.2em 0.8em",
};

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
  nodeName = "",
  filesAndFoldersId,
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
      <span className="edit_hover_container" style={marginPaddingCompensate}>
        <RIEInput
          value={displayName || bracketName}
          change={onChangeAlias(
            "new_display_name",
            filesAndFoldersId,
            nodeName
          )}
          className="editable_text element_name bold"
          propName="new_display_name"
        />
        &ensp;
        <FaPen className="edit_hover_pencil" style={{ opacity: "0.3" }} />
      </span>
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
  <Grid container style={{ height: "3.2em" }}>
    <Grid item style={{ paddingRight: pad }}>
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
  createTag,
  untag,
  updateComment,
  currentFilesAndFolders,
  currentFileHash,
  currentFileAlias,
  currentFileComment,
  filesAndFoldersId,
  filesAndFolders,
  filesAndFoldersMetadata,
  tagsForCurrentFile,
  isCurrentFileMarkedToDelete,
  toggleCurrentFileDeleteState,
  originalPath,
  onChangeAlias,
  fillColor,
  isFocused,
  isLocked,
}) => {
  const isActive = isFocused || isLocked;

  let children = [];
  let nodeName = "";
  let nodeId = "";
  let displayName = "";
  let bracketName = "";
  let isFolder = false;

  if (isActive) {
    children = currentFilesAndFolders.children;
    nodeName = currentFilesAndFolders.name;
    nodeId = currentFilesAndFolders.id;
    displayName = getDisplayName(nodeName, currentFileAlias);
    bracketName = currentFileAlias === "" ? "" : nodeName;
    isFolder = children.length > 0;
  }

  return (
    <div
      style={{
        opacity: isActive ? 1 : 0.5,
        background: "white",
        borderRadius: "5px",
      }}
    >
      <Grid container style={{ padding: pad }}>
        <Grid item xs={8} style={{ paddingRight: pad }}>
          <Grid container>
            <Grid item xs={12} style={{ paddingBottom: pad }}>
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
            <Grid item xs={6} style={{ paddingRight: pad }}>
              <TagsCell
                is_dummy={!isActive}
                isLocked={isLocked}
                isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
                cells_style={cellsStyle}
                nodeId={nodeId}
                tagsForCurrentFile={tagsForCurrentFile}
                filesAndFoldersId={filesAndFoldersId}
                createTag={createTag}
                untag={untag}
                toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
              />
            </Grid>
            <Grid item xs={6}>
              <CommentsCell
                is_dummy={!isActive}
                cells_style={cellsStyle}
                comments={currentFileComment}
                filesAndFoldersId={filesAndFoldersId}
                updateComment={updateComment}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <InfoCell
            currentFileHash={currentFileHash}
            filesAndFolders={filesAndFolders}
            filesAndFoldersId={filesAndFoldersId}
            filesAndFoldersMetadata={filesAndFoldersMetadata}
            placeholder={!isActive}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default function ReportApiToProps({
  originalPath,
  createTag,
  untag,
  currentFileHash,
  currentFileAlias,
  currentFileComment,
  isCurrentFileMarkedToDelete,
  tagsForCurrentFile,
  filesAndFolders,
  filesAndFoldersId,
  filesAndFoldersMetadata,
  isLocked,
  toggleCurrentFileDeleteState,
  updateAlias,
  updateComment,
  fillColor,
}) {
  const isFocused = filesAndFoldersId !== "";

  const isActive = isFocused || isLocked;

  const currentFilesAndFolders = isActive
    ? filesAndFolders[filesAndFoldersId]
    : {};

  // TODO: Refactor this method to use a standard value instead of the riekInputResult value
  const onChangeAlias = useCallback(
    (propName, id, oldName) => (riekInputResult) => {
      let newAlias =
        riekInputResult[propName] === oldName ? "" : riekInputResult[propName];
      newAlias = newAlias.replace(/^\s*|\s*$/g, "");
      updateAlias(newAlias);
    },
    [updateAlias]
  );

  return (
    <Report
      currentFilesAndFolders={currentFilesAndFolders}
      currentFileHash={currentFileHash}
      currentFileAlias={currentFileAlias}
      currentFileComment={currentFileComment}
      filesAndFoldersId={filesAndFoldersId}
      filesAndFolders={filesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      tagsForCurrentFile={tagsForCurrentFile}
      isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
      originalPath={originalPath}
      isFocused={isFocused}
      isLocked={isLocked}
      fillColor={fillColor}
      toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
      createTag={createTag}
      untag={untag}
      updateComment={updateComment}
      onChangeAlias={onChangeAlias}
    />
  );
}
