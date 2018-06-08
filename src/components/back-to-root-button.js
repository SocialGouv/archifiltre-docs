import React from 'react'
import { connect } from 'react-redux'

import { mkB, mkRB } from 'components/button'

import { setNoDisplayRoot } from 'reducers/icicle-state'
import { setNoFocus } from 'reducers/icicle-state'

import { selectIcicleState, commit } from 'reducers/root-reducer'

import * as Color from 'color'

import { tr } from 'dict'


const Presentational = props => {

  const button_style = {
    transition : 'all 0.2s ease-out',
    WebkitTransition : 'all 0.2s ease-out',
    padding:'0.3em 0.45em',
    margin:'0',
    borderRadius: '2em'
  }

  let cursor_style = {cursor: props.isZoomed ? 'pointer' : 'default', padding:'0.3em 0.45em'}

  return mkB(
    props.backToRoot,
    (<span><i className="fi-zoom-out" />&ensp;{tr('Back to root')}</span>),
    props.isZoomed,
    Color.parentFolder(),
    button_style)
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
