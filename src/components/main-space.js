import React from 'react'
import { connect } from 'react-redux'

import { selectAppState } from 'reducers/root-reducer'

import FolderDropzone from 'components/folder-dropzone'
import Icicle from 'components/icicle'
import WorkSpace from 'components/workspace'
import WaitingScreen from 'components/waiting-screen'

import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import ImportButton from 'components/import-button'
import ErrorLogButton from 'components/error-log-button'

import { tr } from 'dict'

const Presentational = props => {
  if (props.started === false && props.finished === false) {
    return (
        <FolderDropzone />
    )
  } else if (props.started === true && props.finished === false) {
    return (<WaitingScreen />)
  } else {
    return (
        <WorkSpace />
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
