import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/root-reducer'

import { setFocus, setDisplayRoot, setNoDisplayRoot } from 'reducers/icicle-state'

import { typeOf } from 'components/icicle'

import { mkDummyParent } from 'table-tree'

import { tr } from 'dict'

const Presentational = props => {
	let node = props.node
	let node_dims = props.dims
	let node_id = props.node_id

	let opacity = props.hover_sequence.includes(-1) ? 1 : (props.hover_sequence.includes(node_id) ? 1 : 0.3)
	let display = node.get('depth') ? "" : "none"

  let is_parent = props.isZoomed && props.display_root.includes(node_id) && node.get('children').size

  let res = [(<rect
      key="rect"
      className="node"
      x={node_dims.x}
      y={node_dims.y}
      width={node_dims.dx}
      height={node_dims.dy}
      onClick={(e) => {e.stopPropagation(); props.setDisplayRoot(props.node_sequence)}}
      onMouseOver={() => {props.setFocus(props.node_sequence, node_dims)}}
      style={{"fill": is_parent ? typeOf(mkDummyParent()).color : typeOf(node).color, "opacity": opacity, "display" : display}}></rect>)]

  if(!(node.get('depth')) && props.isZoomed) res.push(<text
    x={node_dims.dx/2}
    y={node_dims.dy/2}
    dx="0"
    dy={node_dims.dy/4}
    textAnchor="middle"
    stroke="none"
    onClick={(e) => {e.stopPropagation(); props.setNoDisplayRoot() ;}}
    key="text">{tr("Back to root")}</text>)

  return res;
}


const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
	return {
		hover_sequence: icicle_state.hover_sequence(),
    display_root: icicle_state.display_root(),
    isZoomed: icicle_state.isZoomed()
	}
}

const mapDispatchToProps = dispatch => {
 	return {
    setFocus: (...args) => dispatch((setFocus(...args))),
    setDisplayRoot: (...args) => dispatch((setDisplayRoot(...args))),
 		setNoDisplayRoot: (...args) => dispatch((setNoDisplayRoot(...args)))
 	}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
