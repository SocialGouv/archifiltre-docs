import React from 'react'

import FolderDropzone from 'components/folder-dropzone'

import WorkSpace from 'components/workspace'

import WaitingScreen from 'components/waiting-screen'


const grid_style = {
  padding: '0em 5em',
}

const MainSpace = props => {
  const api = props.api
  const app_state = api.app_state

  const started = app_state.isStarted()
  const finished = app_state.isFinished()

  if (started === false && finished === false) {
    return (
      <div className='grid-y grid-padding-x grid-frame align-center' style={grid_style}>
        <div className='cell small-8'>
          <FolderDropzone api={api}/>
        </div>
      </div>
    )
  } else if (started === true && finished === false) {
    return (
      <div className='grid-y grid-padding-x grid-frame align-center'>
        <div className='cell small-8'>
          <WaitingScreen api={api}/>
        </div>
      </div>
    )
  } else {
    return (
      <div className='grid-y grid-padding-x grid-frame align-center'>
        <div className='cell small-12'>
          <WorkSpace api={api}/>
        </div>
      </div>
    )
  }
}

export default MainSpace