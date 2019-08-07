import React from "react";

import * as ObjectUtil from "util/object-util";

import { octet2HumanReadableFormat } from "components/ruler";

import { RIEInput } from "riek";

import SaveButton from "components/save-button";
import SEDAButton from "components/seda-button";
import METSButton from "components/mets-button";
import ReinitButton from "components/reinit-button";
import ToCsvButton from "components/csv-button";
import TextAlignCenter from "components/text-align-center";
import CtrlZ from "components/ctrl-z";

import { mkB } from "components/button";
import Bubble from "components/bubble";
import pick from "languages";
import ResipButton from "./resip-button";
import AuditReportButton from "./audit-report-button";

const DashBoard = props => {
  let session_info_cell = false;
  let ctrlz_cell = false;
  let csv_button_cell = false;
  let seda_button_cell = false;
  let resip_button_cell = false;
  let mets_button_cell = false;
  let save_button_cell = false;
  let reinit_button_cell = false;
  let export_menu_cell = false;
  let audit_button_cell = false;

  const session_info_cell_style = {
    lineHeight: "1em"
  };

  const margin_padding_compensate = {
    margin: "0.2em -0.8em",
    padding: "0.2em 0.8em"
  };

  if (
    props.started === true &&
    props.finished === true &&
    props.error === false
  ) {
    session_info_cell = (
      <div style={session_info_cell_style}>
        <span
          className="edit_hover_container"
          style={margin_padding_compensate}
        >
          <RIEInput
            value={props.sessionName()}
            change={props.onChangeSessionName("new_session_name")}
            propName="new_session_name"
            className="session_name editable_text"
            validate={s => s.replace(/\s/g, "").length > 0}
          />
          &ensp;
          <i
            className="fi-pencil edit_hover_pencil"
            style={{ opacity: "0.3" }}
          />
        </span>
        <br />
        <b>
          {props.nb_folders} <i className="fi-folder" />
          &ensp;&ensp;
          {props.nb_files} <i className="fi-page" />
          &ensp;&ensp;
          {octet2HumanReadableFormat(props.volume)}
        </b>
      </div>
    );

    csv_button_cell = (
      <TextAlignCenter>
        <ToCsvButton api={props.api} />
      </TextAlignCenter>
    );

    seda_button_cell = (
      <TextAlignCenter>
        <SEDAButton api={props.api} />
      </TextAlignCenter>
    );

    resip_button_cell = (
      <TextAlignCenter>
        <ResipButton api={props.api} />
      </TextAlignCenter>
    );

    mets_button_cell = (
      <TextAlignCenter>
        <METSButton api={props.api} />
      </TextAlignCenter>
    );

    save_button_cell = (
      <TextAlignCenter>
        <SaveButton api={props.api} />
      </TextAlignCenter>
    );

    audit_button_cell = (
      <TextAlignCenter>
        <AuditReportButton api={props.api} />
      </TextAlignCenter>
    );

    export_menu_cell = (
      <Bubble
        comp={
          <TextAlignCenter>
            {mkB(
              () => {},
              pick({
                en: "Export to",
                fr: "Exporter vers"
              }),
              true,
              "#4d9e25",
              { width: "90%", cursor: "default" }
            )}
          </TextAlignCenter>
        }
        sub_comp={
          <div className="grid-x">
            <div className="cell small-12">{csv_button_cell}</div>
            <div className="cell small-12">{seda_button_cell}</div>
            <div className="cell small-12">{resip_button_cell}</div>
            <div className="cell small-12">{audit_button_cell}</div>
            <div className="cell small-12">{mets_button_cell}</div>
          </div>
        }
      />
    );
  }

  if (props.started === true && props.finished === true) {
    console.log("reinit");
    reinit_button_cell = (
      <TextAlignCenter>
        <ReinitButton api={props.api} />
      </TextAlignCenter>
    );
  }

  if (props.started === props.finished && props.error === false) {
    ctrlz_cell = <CtrlZ visible={true} api={props.api} />;
  }

  return (
    <div className="grid-x grid-padding-y align-middle">
      <div className="cell small-2">{ctrlz_cell}</div>

      <div className="cell auto" />

      <div className="cell small-3">{session_info_cell}</div>

      <div className="cell auto" />

      <div className="cell small-2">{save_button_cell}</div>

      <div className="cell small-2">{export_menu_cell}</div>

      <div className="cell small-2">{reinit_button_cell}</div>
    </div>
  );
};

export default function DashBoardApiToProps(props) {
  const api = props.api;
  const loading_state = api.loading_state;
  const database = api.database;
  const finished = loading_state.isFinished();
  const error = loading_state.isInError();

  const nb_files = database.fileCount();
  const nb_folders = database.overallCount() - nb_files;
  const volume = database.volume();

  const onChangeSessionName = prop_name => n => {
    if (n[prop_name].length > 0) {
      database.setSessionName(n[prop_name]);
      api.undo.commit();
    }
  };

  props = ObjectUtil.compose(
    {
      started: loading_state.isStarted(),
      finished,
      error,
      nb_files,
      nb_folders,
      volume,
      sessionName: () => database.getSessionName(),
      onChangeSessionName
    },
    props
  );

  return <DashBoard {...props} />;
}
