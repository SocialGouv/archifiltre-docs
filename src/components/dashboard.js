import React from 'react'
// import { connect } from 'react-redux'
// import { selectAppState, selectDatabase } from 'reducers/root-reducer'
// import { commit } from 'reducers/root-reducer'

// import { setSessionName } from 'reducers/database'






// import { octet2HumanReadableFormat } from 'components/ruler'

import { RIEInput } from 'riek'


import SaveButton from 'components/save-button'
import ReinitButton from 'components/reinit-button'
import ToCsvButton from 'components/csv-button'
import TextAlignCenter from 'components/text-align-center'
import CtrlZ from 'components/ctrl-z'

import { edit_hover_container, edit_hover_pencil, editable_text, session_name} from 'css/app.css'

import { tr } from 'dict'


const DashBoard = props => {

  let app_state = selectAppState(state)
  let database = selectDatabase(state)
  const finished = app_state.isFinished()
  let nb_files = 0
  let nb_folders = 0
  let volume = 0
  if (finished) {
    nb_files = database.size_files()
    nb_folders = database.size_overall() - database.size_files()
    volume = database.volume()
  }
  // return {
  //   started: app_state.isStarted(),
  //   finished,
  //   nb_files,
  //   nb_folders,
  //   volume,
  //   session_name: database.getSessionName()
  // }
  

  const onChangeSessionName = (prop_name) => (n) => {
    if(n[prop_name].length > 0){
      dispatch(setSessionName(n[prop_name]))
      dispatch(commit())
    }
  }
  // return {
  //   onChangeSessionName
  // }


  let session_info_cell, ctrlz_cell, csv_button_cell, save_button_cell, reinit_button_cell;

  const session_info_cell_style = {
    lineHeight: '1em'
  }

  const margin_padding_compensate = {
    margin: "0.2em -0.8em",
    padding: "0.2em 0.8em",
  }

  if (props.started === true && props.finished === true) {
    session_info_cell = (
      <div className='cell small-3' style={session_info_cell_style}>
          <span className={edit_hover_container} style={margin_padding_compensate}>
            <RIEInput
              value={props.session_name}
              change={props.onChangeSessionName('new_session_name')}
              propName='new_session_name'
              className={session_name + " " + editable_text}
              validate={(s) => s.replace(/\s/g,'').length > 0}
            />
            &ensp;
            <i className={"fi-pencil " + edit_hover_pencil} style={{'opacity': '0.3'}} />
          </span>
          <br />
          <b>
            {props.nb_folders} <i className="fi-folder" />&ensp;&ensp;
            {props.nb_files} <i className="fi-page" />&ensp;&ensp;
            {octet2HumanReadableFormat(props.volume)}
          </b>
      </div>
    );

    csv_button_cell = (
      <div className='cell small-2'>
        <TextAlignCenter>
          <ToCsvButton/>
        </TextAlignCenter>
      </div>
    );

    save_button_cell = (
      <div className='cell small-2'>
        <TextAlignCenter>
          <SaveButton/>
        </TextAlignCenter>
      </div>
    );

    reinit_button_cell = (
      <div className='cell small-2'>
        <TextAlignCenter>
          <ReinitButton/>
        </TextAlignCenter>
      </div>
    );
  }
  else {
    session_info_cell = <div className='cell small-3'></div>;
    csv_button_cell = <div className='cell small-2'></div>;
    save_button_cell = <div className='cell small-2'></div>;
    reinit_button_cell = <div className='cell small-2'></div>;
  }

  if(props.started === props.finished){
    ctrlz_cell = (
      <div className='cell small-2'>
        <CtrlZ visible={true}/>
      </div>
    );
  }
  else {
    ctrlz_cell = <div className='cell small-2'></div>;
  }


  return (
    <div className='grid-x grid-padding-y align-middle'>
      {ctrlz_cell}
      <div className='cell auto'></div>
      {session_info_cell}
      <div className='cell auto'></div>
      {save_button_cell}
      {csv_button_cell}
      {reinit_button_cell}
    </div>
  )
 
}

export default DashBoard
