import React from 'react'
import { connect } from 'react-redux'

import { mkB, mkRB } from 'components/button'

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
  
  let cursor_style = {cursor: props.isZoomed ? 'pointer' : 'default', padding:'0.3em 0.45em'}

  return <div style={div_style}>{mkRB(props.backToRoot, (<i className="fi-zoom-out" style={{fontSize: '1.8em'}} />), true, Color.parentFolder(), cursor_style)}</div>
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
