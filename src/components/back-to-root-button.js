import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'components/button'

import { setNoDisplayRoot } from 'reducers/icicle-state'
import { setNoFocus } from 'reducers/icicle-state'

import { selectIcicleState, commit } from 'reducers/root-reducer'

import * as Color from 'color'

import { tr } from 'dict'

const Presentational = props => {

  let div_style = {
    opacity: props.isZoomed ? '1' : '0',
    transition : 'opacity 0.2s ease-out',
    WebkitTransition : 'opacity 0.2s ease-out',
  }

  return <div style={div_style}>{mkB(props.backToRoot, tr("Back to root"), true, Color.parentFolder())}</div>
}



const mapStateToProps = state => {
  let icicle_state = selectIcicleState(state)

  return {
    isZoomed: icicle_state.isZoomed(),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    backToRoot: (...args) => {
      dispatch(setNoDisplayRoot())
      dispatch(setNoFocus())
      dispatch(commit())
    }
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
