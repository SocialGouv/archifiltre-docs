import React from 'react'
import { connect } from 'react-redux'
import { selectAppState, selectDatabase, selectLogError } from 'reducers/root-reducer'


import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import ErrorLogButton from 'components/error-log-button'

import { tr } from 'dict'

const dashboard_style = {
  'textAlign':'center',
  'position':'relative'
}

const dashboard_content_style = {
  'position': 'absolute',
  'bottom': '0',
  'width':'100%'
}

const Presentational = props => {
  if (props.started === true && props.finished === true) {
    if(props.nb_errors) {
      return (
        <div className="mdl-cell mdl-cell--3-col" style={dashboard_style}>
          <div style={dashboard_content_style}>
            <p>{props.nb_files} {tr("files loaded")}<br />{props.nb_errors} {tr("errors")}</p>
            <ErrorLogButton /><br /><br />
            <ExportButton /><span>      </span><ReinitButton />
          </div>
        </div>
      )
    } else {
      return (
        <div className="mdl-cell mdl-cell--3-col" style={dashboard_style}>
          <div style={dashboard_content_style}>
            <p>{props.nb_files} {tr("files loaded")}</p>
            <ExportButton /><span>      </span><ReinitButton />
          </div>
        </div>
      )
    }
  } else {
    return (<div className="mdl-cell mdl-cell--3-col" style={dashboard_style}></div>)
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
