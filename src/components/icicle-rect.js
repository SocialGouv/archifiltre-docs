import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/root-reducer'

import { setFocus, setDisplayRoot } from 'reducers/icicle-state'

import { typeOf } from 'components/icicle'

import { tr } from 'dict'

const Presentational = props => {
	let node = props.node
	let node_dims = props.dims
	let node_id = props.node_id

	let opacity = props.hover_sequence.includes(-1) ? 1 : (props.hover_sequence.includes(node_id) ? 1 : 0.3)
	let display = node.depth ? "" : "none"

  let res = [(<rect
      key="rect"
      className="node"
      x={node_dims.x}
      y={node_dims.y}
      width={node_dims.dx}
      height={node_dims.dy}
      onClick={(e) => {e.stopPropagation(); props.setDisplayRoot(props.node_sequence)}}
      onMouseOver={() => {props.setFocus(props.node_sequence, node_dims)}}
      style={{"fill": typeOf(node).color, "opacity": opacity, "display" : display}}></rect>)]

  if(!(node.depth)) res.push(<text
    x={node_dims.dx/2}
    y={node_dims.dy/2}
    dx="0"
    dy={node_dims.dy/4}
    textAnchor="middle"
    stroke="none"
    onClick={(e) => {e.stopPropagation(); if(props.isZoomed) props.setDisplayRoot(node_id) ;}}
    key="text">{tr("Back to root")}</text>)

  return res;
}


const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
	return {
		hover_sequence: icicle_state.hover_sequence(),
    isZoomed: icicle_state.isZoomed()
	}
}

const mapDispatchToProps = dispatch => {
 	return {
    setFocus: (...args) => dispatch((setFocus(...args))),
 		setDisplayRoot: (...args) => dispatch((setDisplayRoot(...args)))
 	}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
