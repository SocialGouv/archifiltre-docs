import React from 'react'
import { connect } from 'react-redux'

import { selectAppState } from 'reducers/root-reducer'

import FolderDropzone from 'components/folder-dropzone'
import Icicle from 'components/icicle'
import WaitingScreen from 'components/waiting-screen'

import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import ImportButton from 'components/import-button'
import ErrorLogButton from 'components/error-log-button'

import { tr } from 'dict'

const Presentational = props => {
  if (props.started === false && props.finished === false) {
    return (
      <div>
        <ImportButton />
        <FolderDropzone />
      </div>
    )
  } else if (props.started === true && props.finished === false) {
    return (<WaitingScreen />)
  } else {
    return (
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
          <ExportButton />
        </div>
        <div className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
          <ReinitButton />
        </div>
        <div className="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
          <ErrorLogButton />
        </div>
        <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
          <Icicle />
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  let app_state = selectAppState(state)
  return {
    started: app_state.isStarted(),
    finished: app_state.isFinished()
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
