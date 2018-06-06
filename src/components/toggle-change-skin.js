import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'components/button'

import { toggleChangeSkin } from 'reducers/icicle-state'

import * as Color from 'color'

import { tr } from 'dict'

const Presentational = props => {

  
  let cursor_style = {cursor: props.isZoomed ? 'pointer' : 'default'}

  return (
    <div>
      {mkB(props.toggleChangeSkin, tr('Toggle Skin'), true, Color.parentFolder(), cursor_style)}
    </div>
  )
}



const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    toggleChangeSkin: () => dispatch(toggleChangeSkin())
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
