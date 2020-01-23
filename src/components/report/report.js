import React from "react";

import { RIEInput } from "riek";

import TagsCell from "components/tags/report-cell-tags";
import CommentsCell from "components/report/report-cell-comments";

import { octet2HumanReadableFormat } from "components/main-space/ruler";

import LastModifiedReporter from "components/report/last-modified-reporter";

import * as Color from "util/color-util";

import { shell } from "electron";
import path from "path";
import Icon, {
  FOLDER_ICON,
  PAGE_ICON,
  PAGE_MULTIPLE_ICON
} from "../common/icon";
import ClickableIcon from "../common/clickable-icon";
import ReactTooltip from "react-tooltip";
import { useTranslation } from "react-i18next";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { lookup } from "mime-types";
import { isFile } from "../../reducers/files-and-folders/files-and-folders-selectors";

const pad = "1em";

const cellsStyle = {
  borderRadius: "1em",
  padding: "0.6em 1em 0 1em",
  fontSize: "0.8em",
  height: "8em"
};

const infoCellStyle = {
  fontSize: "0.8em"
};

const marginPaddingCompensate = {
  padding: "0.2em 0.8em"
};

const overflowEllipsisStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden"
};

const getType = (filesAndFolders, filesAndFoldersId, t) => {
  if (!isFile(filesAndFolders)) return t("common.folder");
  const mimeType = lookup(filesAndFoldersId);
  return mimeType ? mimeType.split("/").pop() : t("common.unknown");
};

const ElementIcon = ({
  placeholder,
  isFolder,
  fillColor,
  filesAndFoldersId,
  onClick
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
  onChangeAlias
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
        <i className="fi-pencil edit_hover_pencil" style={{ opacity: "0.3" }} />
      </span>
    );
  }
};

const RealName = props => {
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
          visibility: bracketName === "" ? "hidden" : ""
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
  onChangeAlias
}) => (
  <div className="grid-x align-middle" style={{ height: "3.2em" }}>
    <div className="cell shrink" style={{ paddingRight: pad }}>
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
    </div>
    <div className="cell auto">
      <div className="grid-x">
        <div className="cell small-12">
          <Name
            placeholder={placeholder}
            onChangeAlias={onChangeAlias}
            filesAndFoldersId={filesAndFoldersId}
            displayName={displayName}
            bracketName={bracketName}
            nodeName={nodeName}
          />
        </div>
        <div className="cell small-12">
          {" "}
          <RealName placeholder={placeholder} bracketName={bracketName} />
        </div>
      </div>
    </div>
  </div>
);

const InfoCell = ({
  currentFileHash,
  placeholder = false,
  filesAndFolders,
  filesAndFoldersId,
  filesAndFoldersMetadata
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
  const typeLabel = placeholder
    ? "..."
    : getType(currentFilesAndFolders, filesAndFoldersId, t);

  return (
    <div style={infoCellStyle}>
      <div>
        <b>{t("report.size")} :</b> {sizeLabel}
      </div>
      <div style={overflowEllipsisStyle}>
        <b>
          {t("report.hash")}&nbsp;
          <span data-tip={hashExplanationText} data-for="hash-explanation">
            <i className="fi-info" />
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
  filesAndFoldersId,
  filesAndFolders,
  filesAndFoldersMetadata,
  tagsForCurrentFile,
  originalPath,
  onChangeAlias,
  fillColor,
  isFocused,
  isLocked
}) => {
  const isActive = isFocused || isLocked;

  let children = [];
  let nodeName = "";
  let nodeAlias = "";
  let nodeComments = "";
  let nodeId = "";
  let displayName = "";
  let bracketName = "";
  let isFolder = false;

  if (isActive) {
    children = currentFilesAndFolders.children;
    nodeName = currentFilesAndFolders.name;
    nodeAlias = currentFilesAndFolders.alias;
    nodeComments = currentFilesAndFolders.comments;
    nodeId = currentFilesAndFolders.id;
    displayName = nodeAlias === "" ? nodeName : nodeAlias;
    bracketName = nodeAlias === "" ? "" : nodeName;
    isFolder = children.length > 0;
  }

  return (
    <div
      style={{
        opacity: isActive ? 1 : 0.5,
        background: "white",
        borderRadius: "1em"
      }}
    >
      <div className="grid-x" style={{ padding: pad }}>
        <div className="cell small-8" style={{ paddingRight: pad }}>
          <div className="grid-x">
            <div className="cell small-12" style={{ paddingBottom: pad }}>
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
            </div>
            <div className="cell small-6" style={{ paddingRight: pad }}>
              <TagsCell
                is_dummy={!isActive}
                cells_style={cellsStyle}
                nodeId={nodeId}
                tagsForCurrentFile={tagsForCurrentFile}
                filesAndFoldersId={filesAndFoldersId}
                createTag={createTag}
                untag={untag}
              />
            </div>
            <div className="cell small-6">
              <CommentsCell
                is_dummy={!isActive}
                cells_style={cellsStyle}
                comments={nodeComments}
                filesAndFoldersId={filesAndFoldersId}
                updateComment={updateComment}
              />
            </div>
          </div>
        </div>
        <div className="cell small-4">
          <InfoCell
            currentFileHash={currentFileHash}
            filesAndFolders={filesAndFolders}
            filesAndFoldersId={filesAndFoldersId}
            filesAndFoldersMetadata={filesAndFoldersMetadata}
            placeholder={!isActive}
          />
        </div>
      </div>
    </div>
  );
};

export default function ReportApiToProps({
  api,
  createTag,
  untag,
  currentFileHash,
  tagsForCurrentFile,
  filesAndFolders,
  filesAndFoldersId,
  filesAndFoldersMetadata,
  updateComment,
  fillColor
}) {
  const icicle_state = api.icicle_state;
  const database = api.database;

  const originalPath = api.database.getOriginalPath();

  const isFocused = icicle_state.isFocused();
  const isLocked = icicle_state.isLocked();

  const isActive = isFocused || isLocked;

  const currentFilesAndFolders = isActive
    ? filesAndFolders[filesAndFoldersId]
    : {};

  // TODO: Refactor this method to use a standard value instead of the riekInputResult value
  const onChangeAlias = (propName, id, oldName) => riekInputResult => {
    let newAlias =
      riekInputResult[propName] === oldName ? "" : riekInputResult[propName];
    newAlias = newAlias.replace(/^\s*|\s*$/g, "");
    addTracker({
      title: ActionTitle.ALIAS_ADDED,
      type: ActionType.TRACK_EVENT,
      value: `Created alias: "${newAlias}"`,
      eventValue: newAlias
    });
    database.updateAlias(() => newAlias, id);
    api.undo.commit();
  };

  return (
    <Report
      currentFilesAndFolders={currentFilesAndFolders}
      currentFileHash={currentFileHash}
      filesAndFoldersId={filesAndFoldersId}
      filesAndFolders={filesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      tagsForCurrentFile={tagsForCurrentFile}
      originalPath={originalPath}
      isFocused={isFocused}
      isLocked={isLocked}
      fillColor={fillColor}
      createTag={createTag}
      untag={untag}
      updateComment={updateComment}
      onChangeAlias={onChangeAlias}
    />
  );
}
