import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState, commit } from 'reducers/root-reducer'

import { setFocus, setNoFocus, setDisplayRoot, lock } from 'reducers/icicle-state'

import { isLeaf } from 'table-tree'

class SvgRectangle extends React.PureComponent {
  // shouldComponentUpdate(nextProps, nextState) {
  //   let ans = true
  //   let logs = []
  //   for (let key in this.props) {
  //     ans = ans && this.props[key] === nextProps[key]
  //     if (this.props[key] !== nextProps[key]) {
  //       logs.push(key)
  //     }
  //   }
  //   if (!ans) {
  //     // console.log(ans, logs)
  //   }
  //   return false
  // }

  render() {
    const props = this.props
    const x = props.x
    const y = props.y
    const dx = props.dx
    const dy = props.dy
    const onClickHandler = props.onClickHandler
    const onDoubleClickHandler = props.onDoubleClickHandler
    const onMouseOverHandler = props.onMouseOverHandler
    // const onMouseOutHandler = props.onMouseOutHandler
    const fill = props.fill
    const opacity = props.opacity

    return (
      <rect
        className='node'
        x={x}
        y={y}
        width={dx}
        height={dy}
        onClick={onClickHandler}
        onDoubleClick={onDoubleClickHandler}
        onMouseOver={onMouseOverHandler}
        // onMouseOut={onMouseOutHandler}
        style={{'fill': fill, 'opacity': opacity}}
      />
    )
  }
}


class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    this.d_setFocus = this.d_setFocus.bind(this)
    this.d_setNoFocus = this.d_setNoFocus.bind(this)
    this.d_setDisplayRoot = this.d_setDisplayRoot.bind(this)
    this.d_lock = this.d_lock.bind(this)

    this.dims = this.dims.bind(this)

    this.nodeSequence = this.nodeSequence.bind(this)
    this.onClickHandler = this.onClickHandler.bind(this)
    this.onDoubleClickHandler = this.onDoubleClickHandler.bind(this)
    this.onMouseOverHandler = this.onMouseOverHandler.bind(this)
    this.onMouseOutHandler = this.onMouseOutHandler.bind(this)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let ans = true
  //   let logs = []
  //   for (let key in this.props) {
  //     ans = ans && this.props[key] === nextProps[key]
  //     if (this.props[key] !== nextProps[key]) {
  //       logs.push(key)
  //     }
  //   }
  //   console.log(ans, logs)
  //   return !ans
  // }

  d_setFocus(...args) {
    this.props.dispatch((setFocus(...args)))
  }
  d_setNoFocus(...args) {
    this.props.dispatch((setNoFocus(...args)))
  }
  d_setDisplayRoot(...args) {
    this.props.dispatch((setDisplayRoot(...args)))
  }
  d_lock(...args) {
    this.props.dispatch((lock(...args)))
    this.props.dispatch(commit())
  }

  dims() {
    return {
      x:this.props.x,
      y:this.props.y,
      dx:this.props.dx,
      dy:this.props.dy,
    }
  }

  nodeSequence() {
    return this.props.nodeSequence(this.props.node_id)
  }
  onClickHandler(e) {
    e.stopPropagation()
    this.d_lock(this.nodeSequence(), this.dims())
  }
  onDoubleClickHandler() {
    this.d_setDisplayRoot(this.nodeSequence())
  }
  onMouseOverHandler() {
    this.d_setFocus(this.nodeSequence(), this.dims(), this.props.isLocked)
  }
  // #### perf bottleneck ####
  // when mouse go from IcicleRect to IcicleRect, trigger Out event => Hover event
  // d_setNoFocus trigger a redering of all the IcicleRect
  onMouseOutHandler() {
    if (!this.props.isLocked) {
      this.d_setNoFocus()
    }
  }


  render() {
    // const hover_sequence = this.props.hover_sequence
    // const lock_sequence = this.props.lock_sequence
    const node_id = this.props.node_id
    // const isInHoverSeq = hover_sequence.includes(node_id)
    // const isInLockSeq = lock_sequence.includes(node_id)

    const isLocked = this.props.isLocked
    const isFocused = this.props.isFocused
    const isInHoverSeq = this.props.isInHoverSeq
    const isInLockSeq = this.props.isInLockSeq

    const opacity =
      (isLocked ?
        (isInLockSeq ?
          1
        :
          (isInHoverSeq ? 0.6 : 0.3)
        )
      :
        (isFocused ?
          (isInHoverSeq ? 1 : 0.3)
        :
          1
        )
      )

    const fill = this.props.fillColor(node_id)

    // return (
    //   <rect
    //     className='node'
    //     x={this.props.x}
    //     y={this.props.y}
    //     width={this.props.dx}
    //     height={this.props.dy}
    //     onClick={this.onClickHandler}
    //     onDoubleClick={this.onDoubleClickHandler}
    //     onMouseOver={this.onMouseOverHandler}
    //     // onMouseOut={this.onMouseOutHandler}
    //     style={{'fill': fill, 'opacity': opacity}}
    //   />
    // )

    return (
      <SvgRectangle
        x={this.props.x}
        y={this.props.y}
        dx={this.props.dx}
        dy={this.props.dy}
        onClickHandler={this.onClickHandler}
        onDoubleClickHandler={this.onDoubleClickHandler}
        onMouseOverHandler={this.onMouseOverHandler}
        // onMouseOutHandler={this.onMouseOutHandler}
        fill={fill}
        opacity={opacity}
      />
    )
  }
}



const mapStateToProps = (state, props) => {
  const database = selectDatabase(state)
  const icicle_state = selectIcicleState(state)
  const hover_sequence = icicle_state.hover_sequence()
  const lock_sequence = icicle_state.lock_sequence()


  const isInHoverSeq = hover_sequence.includes(props.node_id)
  const isInLockSeq = lock_sequence.includes(props.node_id)


  return {
    isFocused: icicle_state.isFocused(),
    isLocked: icicle_state.isLocked(),
    isInHoverSeq,
    isInLockSeq,
    // hover_sequence,
    // lock_sequence,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
