import React from 'react'
import { connect } from 'react-redux'

import { selectAppState } from 'reducers/root-reducer'

import FolderDropzone from 'components/folder-dropzone'
import Icicle from 'components/icicle'
import WorkSpace from 'components/workspace'
import WaitingScreen from 'components/waiting-screen'

import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import CtrlZ from 'components/ctrl-z'

import { tr } from 'dict'

const grid_style = {
  padding: '0em 5em'
}

const Presentational = props => {
  if (props.started === false && props.finished === false) {
    return (
      <div className='grid-y grid-padding-x grid-frame align-center' style={grid_style}>
        <div className='cell small-8'>
          <FolderDropzone/>
        </div>
      </div>
    )
  } else if (props.started === true && props.finished === false) {
    return (
      <div className='grid-y grid-padding-x grid-frame align-center'>
        <div className='cell small-8'>
          <WaitingScreen/>
        </div>
      </div>
    )
  } else {
    return (
      <div className='grid-y grid-padding-x grid-frame align-center'>
        <div className='cell small-12'>
          <WorkSpace />
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
