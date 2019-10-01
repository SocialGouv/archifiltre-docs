import React from "react";

import * as ObjectUtil from "util/object-util.ts";
import { RIEInput } from "riek";

import TagsCell from "components/report-cell-tags";
import CommentsCell from "components/report-cell-comments";

import { octet2HumanReadableFormat } from "components/ruler";

import LastModifiedReporter from "components/last-modified-reporter";

import * as Color from "util/color-util";

import pick from "languages";

import { shell } from "electron";
import path from "path";
import Icon, { FOLDER_ICON, PAGE_ICON, PAGE_MULTIPLE_ICON } from "./icon";
import ClickableIcon from "./clickable-icon";

const folder_of_name_tr = pick({
  en: "Folder of file's name",
  fr: "Nom du répertoire ou fichier"
});
const real_name_tr = pick({
  en: "Real name",
  fr: "Nom réel"
});
const size_tr = pick({
  en: "Size",
  fr: "Taille"
});

const hash_tr = pick({
  en: "Hash",
  fs: "Hash"
});

const pad = "1em";

const cells_style = {
  borderRadius: "1em",
  padding: "0.6em 1em 0 1em",
  fontSize: "0.8em",
  height: "8em"
};

const info_cell_style = {
  fontSize: "0.8em"
};

const margin_padding_compensate = {
  padding: "0.2em 0.8em"
};

const ElementIcon = props => {
  const placeholder = props.placeholder;
  const is_folder = props.is_folder;
  const fillColor = props.fillColor;
  const node_id = props.node_id;

  let icon;
  let color;
  if (placeholder) {
    return <Icon icon={PAGE_MULTIPLE_ICON} color={Color.placeholder()} />;
  }

  color = fillColor(node_id);
  if (is_folder) {
    icon = FOLDER_ICON;
  } else {
    icon = PAGE_ICON;
  }

  return <ClickableIcon icon={icon} color={color} onClick={props.onClick} />;
};

const Name = props => {
  const placeholder = props.placeholder;
  const display_name = props.display_name;
  const bracket_name = props.bracket_name;
  const n_name = props.n_name;

  if (placeholder) {
    return <div style={{ fontWeight: "bold" }}>{folder_of_name_tr}</div>;
  } else {
    return (
      <span className="edit_hover_container" style={margin_padding_compensate}>
        <RIEInput
          value={display_name.length > 0 ? display_name : bracket_name}
          change={props.onChangeAlias(
            "new_display_name",
            props.node_id,
            n_name
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
  const placeholder = props.placeholder;
  const bracket_name = props.bracket_name;

  if (placeholder) {
    return <div style={{ fontStyle: "italic" }}>({real_name_tr})</div>;
  } else {
    return (
      <div
        style={{
          fontStyle: "italic",
          visibility: bracket_name === "" ? "hidden" : ""
        }}
      >
        ({bracket_name})
      </div>
    );
  }
};

const InfoCell = props => {
  const api = props.api;
  const placeholder = props.placeholder;
  const c_size = props.c_size;
  const node_id = props.node_id;

  let size_label;
  let component;
  if (placeholder) {
    size_label = "...";
    component = <LastModifiedReporter api={api} placeholder={true} />;
  } else {
    size_label = c_size;
    component = (
      <LastModifiedReporter api={api} id={node_id} placeholder={false} />
    );
  }

  return (
    <div style={info_cell_style}>
      <div>
        <b>{size_tr} :</b> {size_label}
      </div>
      <div>
        <b>{hash_tr} :</b> {props.hash || "..."}
      </div>
      <br />
      {component}
    </div>
  );
};

const Report = props => {
  const api = props.api;
  const isActive = props.isFocused || props.isLocked;
  let icon, name, real_name, info_cell, tags_cell, comments_cell, name_cell;

  if (isActive) {
    const node = props.node;
    const n_children = node.get("children");
    const n_name = node.get("name");

    const c_size = octet2HumanReadableFormat(node.get("size"));
    const hash = node.get("hash");

    const c_alias = node.get("alias");
    const c_comments = node.get("comments");

    const display_name = c_alias === "" ? n_name : c_alias;
    const bracket_name = c_alias === "" ? "" : n_name;

    const is_folder = n_children.size > 0;
    icon = (
      <ElementIcon
        is_folder={is_folder}
        fillColor={props.fillColor}
        node_id={props.node_id}
        onClick={() => {
          const originalPath = api.database.getOriginalPath();
          const itemPath = path.join(originalPath, "..", props.node_id);
          shell.openItem(itemPath);
        }}
      />
    );

    name = (
      <Name
        onChangeAlias={props.onChangeAlias}
        node_id={props.node_id}
        display_name={display_name}
        bracket_name={bracket_name}
        n_name={n_name}
      />
    );

    real_name = <RealName bracket_name={bracket_name} />;

    info_cell = (
      <InfoCell api={api} c_size={c_size} hash={hash} node_id={props.node_id} />
    );

    tags_cell = (
      <TagsCell
        api={api}
        is_dummy={false}
        cells_style={cells_style}
        tagsForCurrentFile={props.tagsForCurrentFile}
        node_id={props.node_id}
      />
    );
    comments_cell = (
      <CommentsCell
        api={api}
        is_dummy={false}
        cells_style={cells_style}
        comments={c_comments}
        node_id={props.node_id}
      />
    );
  } else {
    icon = <ElementIcon placeholder={true} />;
    name = <Name placeholder={true} />;
    real_name = <RealName placeholder={true} />;
    info_cell = <InfoCell api={api} placeholder={true} />;
    tags_cell = (
      <TagsCell api={api} is_dummy={true} cells_style={cells_style} />
    );
    comments_cell = (
      <CommentsCell api={api} is_dummy={true} cells_style={cells_style} />
    );
  }

  name_cell = (
    <div className="grid-x align-middle" style={{ height: "3.2em" }}>
      <div className="cell shrink" style={{ paddingRight: pad }}>
        {icon}
      </div>
      <div className="cell auto">
        <div className="grid-x">
          <div className="cell small-12">{name}</div>
          <div className="cell small-12">{real_name}</div>
        </div>
      </div>
    </div>
  );

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
              {name_cell}
            </div>
            <div className="cell small-6" style={{ paddingRight: pad }}>
              {tags_cell}
            </div>
            <div className="cell small-6">{comments_cell}</div>
          </div>
        </div>
        <div className="cell small-4">{info_cell}</div>
      </div>
    </div>
  );
};

export default function ReportApiToProps(props) {
  const api = props.api;
  const icicle_state = api.icicle_state;
  const database = api.database;

  const sequence = icicle_state.sequence();
  const getFfByFfId = database.getFfByFfId;

  const node_id = sequence[sequence.length - 1];

  const isFocused = icicle_state.isFocused();
  const isLocked = icicle_state.isLocked();

  const isActive = isFocused || isLocked;

  let node = isActive ? getFfByFfId(node_id) : {};

  let total_size = database.volume();

  const onChangeAlias = (prop_name, id, old_name) => n => {
    let new_alias = n[prop_name] === old_name ? "" : n[prop_name];
    new_alias = new_alias.replace(/^\s*|\s*$/g, "");

    database.updateAlias(() => new_alias, id);
    api.undo.commit();
  };

  props = ObjectUtil.compose(
    {
      isFocused,
      isLocked,
      node,
      node_id,
      tagsForCurrentFile: props.tagsForCurrentFile,
      total_size,
      onChangeAlias
    },
    props
  );

  return <Report {...props} />;
}
