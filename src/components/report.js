import React from "react";

import { RIEInput } from "riek";

import TagsCell from "components/tags/report-cell-tags";
import CommentsCell from "components/report-cell-comments";

import { octet2HumanReadableFormat } from "components/ruler";

import LastModifiedReporter from "components/last-modified-reporter";

import * as Color from "util/color-util";

import pick from "languages";

import { shell } from "electron";
import path from "path";
import Icon, { FOLDER_ICON, PAGE_ICON, PAGE_MULTIPLE_ICON } from "./icon";
import ClickableIcon from "./clickable-icon";
import ReactTooltip from "react-tooltip";

const FILE_OR_FOLDER_NAME_TEXT = pick({
  en: "Folder of file's name",
  fr: "Nom du répertoire ou fichier"
});
const FILE_OR_FOLDER_REAL_NAME_TEXT = pick({
  en: "Real name",
  fr: "Nom réel"
});
const SIZE_TEXT = pick({
  en: "Size",
  fr: "Taille"
});

const HASH_TEXT = pick({
  en: "Hash",
  fr: "Hash"
});

const FILE_HASH_EXPLANATION_TEXT = pick({
  en: "This hash is a file footprint computed with the MD5 algorithm",
  fr: "Ce hash est une empreinte de fichier calculée avec l'algorithme MD5"
});

const FOLDER_HASH_EXPLANATION_TEXT = pick({
  en:
    "This hash is a footprint (computed with the MD5 algorithm) of this folder's children hashes concatenation",
  fr:
    "Ce hash est une empreinte (calculée avec l'algorithme MD5) de la concaténation des hashs des enfants de ce dossier"
});

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
  if (placeholder) {
    return <div style={{ fontWeight: "bold" }}>{FILE_OR_FOLDER_NAME_TEXT}</div>;
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

  if (placeholder) {
    return (
      <div style={{ fontStyle: "italic" }}>
        ({FILE_OR_FOLDER_REAL_NAME_TEXT})
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
    ? FOLDER_HASH_EXPLANATION_TEXT
    : FILE_HASH_EXPLANATION_TEXT;

  return (
    <div style={infoCellStyle}>
      <div>
        <b>{SIZE_TEXT} :</b> {sizeLabel}
      </div>
      <div>
        <b>
          {HASH_TEXT}&nbsp;
          <span data-tip={hashExplanationText}>
            <i className="fi-info" />
          </span>
          &nbsp;:&nbsp;
        </b>
        {hashLabel}
        <ReactTooltip place={"bottom"} />
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
  let displayName = "";
  let bracketName = "";
  let isFolder = false;

  if (isActive) {
    children = currentFilesAndFolders.children;
    nodeName = currentFilesAndFolders.name;
    nodeAlias = currentFilesAndFolders.alias;
    nodeComments = currentFilesAndFolders.comments;
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
