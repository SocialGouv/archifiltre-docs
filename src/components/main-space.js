import React from 'react'
// import { connect } from 'react-redux'

// import { selectAppState, selectIcicleState } from 'reducers/root-reducer'

import FolderDropzone from 'components/folder-dropzone'

// import WorkSpace from 'components/workspace'
// import WorkSpaceTime from 'components/workspace-time'

// import WaitingScreen from 'components/waiting-screen'

import { tr } from 'dict'

const grid_style = {
  padding: '0em 5em',
}

export default MainSpace = props => {
  // const app_state = selectAppState(state)
  // const icicle_state = selectIcicleState(state)

  // return {
  //   started: app_state.isStarted(),
  //   finished: app_state.isFinished(),
  //   change_skin: icicle_state.changeSkin(),
  // }


  if (props.started === false && props.finished === false) {
    return (
      <div className='grid-y grid-padding-x grid-frame align-center' style={grid_style}>
        <div className='cell small-8'>
          <FolderDropzone/>
        </div>
      </div>
    )
  }
  // } else if (props.started === true && props.finished === false) {
  //   return (
  //     <div className='grid-y grid-padding-x grid-frame align-center'>
  //       <div className='cell small-8'>
  //         <WaitingScreen/>
  //       </div>
  //     </div>
  //   )
  // } else {
  //   return (
  //     <div className='grid-y grid-padding-x grid-frame align-center'>
  //       <div className='cell small-12'>
  //         {props.change_skin === false && <WorkSpace/>}
  //         {props.change_skin === true && <WorkSpaceTime/>}
  //       </div>
  //     </div>
  //   )
  // }
}

