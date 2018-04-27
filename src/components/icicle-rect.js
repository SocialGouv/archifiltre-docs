import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/root-reducer'

import { setFocus, setDisplayRoot, setNoDisplayRoot } from 'reducers/icicle-state'

import { typeOf } from 'components/icicle'

import { mkDummyParent } from 'table-tree'

import { tr } from 'dict'

class Presentational extends React.Component {
  constructor (props) {
    super(props)
  	this.node = props.node
  	this.node_dims = props.dims
  	this.node_id = props.node_id
    this.node_sequence = props.node_sequence
    this.isZoomed = props.isZoomed

  	this.opacity = props.isFocused ? (props.isInHoverSeq ? 1 : 0.3) : 1
    console.log("coucou ", props.isFocused ? (props.isInHoverSeq ? 1 : 0.3) : 1, " ", this.opacity)
    this.display = this.node.get('depth') ? "" : "none"

    this.is_parent = props.isZoomed && props.display_root.includes(this.node_id) && this.node.get('children').size
  }

  render() {
    let res = [(<rect
        key="rect"
        className="node"
        x={this.node_dims.x}
        y={this.node_dims.y}
        width={this.node_dims.dx}
        height={this.node_dims.dy}
        onClick={(e) => {e.stopPropagation(); this.props.setDisplayRoot(this.node_sequence)}}
        onMouseOver={() => {this.props.setFocus(this.node_sequence, this.node_dims)}}
        style={{"fill": this.is_parent ? typeOf(mkDummyParent()).color : typeOf(this.node).color, "opacity": this.opacity, "display" : this.display}}></rect>)]

    if(!(this.node.get('depth')) && this.isZoomed) res.push(<text
      x={this.node_dims.dx/2}
      y={this.node_dims.dy/2}
      dx="0"
      dy={this.node_dims.dy/4}
      textAnchor="middle"
      stroke="none"
      onClick={(e) => {e.stopPropagation(); this.props.setNoDisplayRoot() ;}}
      key="text">{tr("Back to root")}</text>)

    return res;
  }
}


const mapStateToProps = (state, props) => {
	let icicle_state = selectIcicleState(state)
  let hover_sequence = icicle_state.hover_sequence()

  let isInHoverSeq = hover_sequence.includes(props.node_id)

	return {
    display_root: icicle_state.display_root(),
    isZoomed: icicle_state.isZoomed(),
    isFocused: icicle_state.isFocused(),
    isInHoverSeq
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
