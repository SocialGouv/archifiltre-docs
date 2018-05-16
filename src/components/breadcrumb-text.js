import React from 'react'
import { connect } from 'react-redux'

import { smartClip } from 'components/breadcrumbs'

import { tr } from 'dict'

const Presentational = props => {

  let available_space = props.w*6/7
  let font_width = 6

  return (<text
      className="breadcrumb-text"
      x={props.w - available_space}
      y={props.level*props.step}
      dx="0"
      dy={props.step/2 + 5}
      textAnchor="start"
      stroke="none"
      fontWeight={props.is_dummy ? "bold" : ""}
      fontSize={props.text.length*font_width < 0.8*available_space ? "1em" : "0.7em"}>
      {(props.text.length*font_width < 0.8*available_space ?
        smartClip(props.text, 0.8*available_space, font_width)
        :
        smartClip(props.text, 0.8*available_space, 0.75*font_width))}
      </text>);
}


const mapStateToProps = state => {
	return {}
}

const mapDispatchToProps = dispatch => {
 	return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
