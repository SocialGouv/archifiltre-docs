import React from 'react'
import { connect } from 'react-redux'
import { selectAppState, selectDatabase } from 'reducers/root-reducer'
import { commit } from 'reducers/root-reducer'

import { setSessionName } from 'reducers/database'
import { octet2HumanReadableFormat } from 'components/ruler'

import { RIEInput } from 'riek'


import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import ToCsvButton from 'components/csv-button'
import TextAlignCenter from 'components/text-align-center'

import { edit_hover_container, edit_hover_pencil} from 'css/app.css'

import { tr } from 'dict'

const error_log_button_style = {
  marginBottom: '0.4em',
  marginTop: '0.4em'
}

const Presentational = props => {
  if (props.started === true && props.finished === true) {
      return (
        <div className='grid-x'>
          <div className='cell small-12'>
            <TextAlignCenter>
              <span style={{'fontWeight':'bold'}} className={edit_hover_container}>
                <RIEInput
                  value={props.session_name}
                  change={props.onChangeSessionName('new_session_name')}
                  propName='new_session_name'
                />
                &ensp;
                <i className={"fi-pencil " + edit_hover_pencil} style={{'opacity': '0.3'}} />
              </span>
              <p>{props.nb_files} {tr('files loaded')}, {octet2HumanReadableFormat(props.volume)}</p>
            </TextAlignCenter>
          </div>
          <div className='cell small-12' style={error_log_button_style}>
            <TextAlignCenter>
              <ToCsvButton/>
            </TextAlignCenter>
          </div>
          <div className='cell small-6'>
            <TextAlignCenter>
              <ExportButton/>
            </TextAlignCenter>
          </div>
          <div className='cell small-6'>
            <TextAlignCenter>
              <ReinitButton/>
            </TextAlignCenter>
          </div>
        </div>
      )
  } else {
    return (<div></div>)
  }
}

const mapStateToProps = state => {
  let app_state = selectAppState(state)
  let database = selectDatabase(state)
  const finished = app_state.isFinished()
  let nb_files = 0
  let volume = 0
  if (finished) {
    nb_files = database.size()
    volume = database.volume()
  }
  return {
    started: app_state.isStarted(),
    finished,
    nb_files,
    volume,
    session_name: database.getSessionName()
  }
}

const mapDispatchToProps = dispatch => {

  const onChangeSessionName = (prop_name) => (n) => {
    dispatch(setSessionName(n[prop_name]))
    dispatch(commit())
  }
  return {
    onChangeSessionName
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
