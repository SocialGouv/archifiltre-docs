import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/root-reducer'

import { setFocus } from 'reducers/icicle-state'

import { tr } from 'dict'

const Presentational = props => {
	let node = props.node

	let opacity = props.hover_sequence.includes(-1) ? 1 : (props.hover_sequence.includes(node.id) ? 1 : 0.3)
	let display = node.depth ? "" : "none"

  return (<rect
      className="node"
      x={node.x}
      y={node.y}
      width={node.dx}
      height={node.dy}
      onMouseOver={() => {props.setFocus(props.node_sequence)}}
      style={{"fill": props.type.color, "opacity": opacity, "display" : display}}></rect>);
}


const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
	return {
		hover_sequence: icicle_state.hover_sequence()
	}
}

const mapDispatchToProps = dispatch => {
 	return {
 		setFocus: (...args) => dispatch((setFocus(...args)))
 	}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
