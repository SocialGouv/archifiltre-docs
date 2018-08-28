import React from 'react'
// import { connect } from 'react-redux'

import { mkB } from 'components/button'

// import { reInit as re1 } from 'reducers/database'
// import { reInit as re2 } from 'reducers/app-state'
// import { setNoFocus as re4 } from 'reducers/icicle-state'
// import { setNoDisplayRoot as re5 } from 'reducers/icicle-state'

// import { commit } from 'reducers/root-reducer'

import { tr } from 'dict'

export default ReinitButton = props => {
    // reInitStateApp: (...args) => {
    //   dispatch(re1())
    //   dispatch(re2())
    //   dispatch(re4())
    //   dispatch(re5())
    //   dispatch(commit())
    // }

  return mkB(props.reInitStateApp, tr("Close"), true, "#e04d1c")
}

