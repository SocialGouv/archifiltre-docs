import React from 'react'
import { connect } from 'react-redux'

import { selectAppState } from 'reducers/root-reducer'

import FolderDropzone from 'components/folder-dropzone'
import Icicle from 'components/icicle'
import WaitingScreen from 'components/waiting-screen'
import ExportButton from 'components/export-button'
import ImportButton from 'components/import-button'

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
      <div>
        <ExportButton />
        <Icicle />
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
