import React from 'react'
import { connect } from 'react-redux'
import { selectAppState, selectDatabase, selectLogError } from 'reducers/root-reducer'


import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import ErrorLogButton from 'components/error-log-button'
import TextAlignCenter from 'components/text-align-center'

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
              <p>{props.nb_files} {tr('files loaded')}</p>
            </TextAlignCenter>
          </div>
          {props.nb_errors > 0 && 
            <div className='cell small-12' style={error_log_button_style}>
              <TextAlignCenter>
                <ErrorLogButton/>
              </TextAlignCenter>
            </div>
          }
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
  let logError = selectLogError(state)
  return {
    started: app_state.isStarted(),
    finished: app_state.isFinished(),
    nb_files: database.size(),
    nb_errors: logError.size()
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
