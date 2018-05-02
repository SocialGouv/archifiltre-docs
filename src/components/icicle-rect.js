import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/root-reducer'

import { setFocus, setNoFocus, setDisplayRoot, setNoDisplayRoot } from 'reducers/icicle-state'

import { typeOf } from 'components/icicle'

import { mkDummyParent } from 'table-tree'

import { tr } from 'dict'

class Presentational extends React.Component {
  constructor (props) {
    super(props)
    this.node_id = props.node_id
    // this.node_dims = props.dims
    this.node = props.node

    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)

  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.isFocused !== this.props.isFocused) return true;
    if(nextProps.isInHoverSeq !== this.props.isInHoverSeq) return true;
    if(nextProps.display_root !== this.props.display_root) return true;
    return false;
  }

  render() {
    console.log("updating")
    // console.time("updating")
    let opacity = this.props.isFocused ? (this.props.isInHoverSeq ? 1 : 0.3) : 1
    let display = this.node.get('depth') ? "" : "none"
    let is_parent = this.props.isZoomed && this.props.display_root.includes(this.node_id) && this.node.get('children').size
    let fill = is_parent ? typeOf(mkDummyParent()).color : typeOf(this.node).color

    let res = [(<rect
        key="rect"
        className="node"
        x={this.props.dims.x}
        y={this.props.dims.y}
        width={this.props.dims.dx}
        height={this.props.dims.dy}
        onClick={(e) => {e.stopPropagation(); this.props.setDisplayRoot(this.props.node_sequence)}}
        onMouseOver={() => {this.props.setFocus(this.props.node_sequence, this.props.dims)}}
        style={{"fill": fill, "opacity": opacity, "display" : display}}></rect>)]

    if(!(this.node.get('depth')) && this.props.isZoomed) res.push(<text
      x={this.props.dims.dx/2}
      y={this.props.dims.dy/2}
      dx="0"
      dy={this.props.dims.dy/4}
      textAnchor="middle"
      stroke="none"
      onClick={(e) => {e.stopPropagation(); this.props.setNoDisplayRoot() ; this.props.setNoFocus() ;}}
      key="text">{tr("Back to root")}</text>);

    // console.timeEnd("updating")

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
    setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    setDisplayRoot: (...args) => dispatch((setDisplayRoot(...args))),
 		setNoDisplayRoot: (...args) => dispatch((setNoDisplayRoot(...args)))
 	}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
