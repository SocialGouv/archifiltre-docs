import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/icicle-state'

import { tr } from 'dict'

const Presentational = props => {
	let opacity = props.hover_sequence.includes(props.id)
  return (<rect
      key={node.name + node.depth}
      className="node"
      x={node.x}
      y={node.y}
      width={node.dx}
      height={node.dy}
      style={{"fill": this.typeOf(node).color, "opacity": "1"}}></rect>);
}


const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
	return {
		hover_sequence: icicle_state.hover_sequence()
	}
}

const mapDispatchToProps = dispatch => {
 	return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
