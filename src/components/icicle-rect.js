import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState, commit } from 'reducers/root-reducer'

import { setFocus, setNoFocus, setDisplayRoot, lock } from 'reducers/icicle-state'

import { isLeaf } from 'table-tree'

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
  //   // console.log(ans, logs)
  //   return true
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
    const opacity =
      (this.props.isLocked ?
        (this.props.isInLockSeq ?
          1
        :
          (this.props.isInHoverSeq ? 0.6 : 0.3)
        )
      :
        (this.props.isFocused ?
          (this.props.isInHoverSeq ? 1 : 0.3)
        :
          1
        )
      )

    const fill = this.props.fillColor(this.props.node_id)

    const res = [(
      <rect
        key='rect'
        className='node'
        x={this.props.x}
        y={this.props.y}
        width={this.props.dx}
        height={this.props.dy}
        onClick={this.onClickHandler}
        onDoubleClick={this.onDoubleClickHandler}
        onMouseOver={this.onMouseOverHandler}
        // onMouseOut={this.onMouseOutHandler}
        style={{'fill': fill, 'opacity': opacity}}
      >
      </rect>
    )]

    return res
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
