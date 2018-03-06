import React from 'react'
import { connect } from 'react-redux'

import { isStarted, isFinished } from 'reducers/app-state'

import FolderDropzone from 'components/folder-dropzone'
import Icicle from 'components/icicle'
import WaitingScreen from 'components/waiting-screen'

const Presentational = props => {
  if (props.started === false && props.finished === false) {
    return (<FolderDropzone />)
  } else if (props.started === true && props.finished === false) {
    return (<WaitingScreen />)
  } else {
    return (<Icicle />)
  }
}


const mapStateToProps = state => {
  return {
    started: isStarted(state),
    finished: isFinished(state)
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
