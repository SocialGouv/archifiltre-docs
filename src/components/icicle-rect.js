import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setFocus, setNoFocus, setDisplayRoot, setNoDisplayRoot, lock } from 'reducers/icicle-state'

import { commit } from 'reducers/root-reducer'


class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)
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
  //   // console.log(ans)
  //   // console.log(ans, logs)
  //   return true
  // }


  render() {
    const d_setFocus = (...args) => this.props.dispatch((setFocus(...args)))
    const d_setNoFocus = (...args) => this.props.dispatch((setNoFocus(...args)))
    const d_setDisplayRoot = (...args) => this.props.dispatch((setDisplayRoot(...args)))
    const d_setNoDisplayRoot = (...args) => this.props.dispatch((setNoDisplayRoot(...args)))
    const d_lock = (...args) => {
      this.props.dispatch((lock(...args)))
      this.props.dispatch(commit())
    }

    const dims = {
      x:this.props.x,
      y:this.props.y,
      dx:this.props.dx,
      dy:this.props.dy,
    }

    const nodeSequence = () => this.props.getIDPath(this.props.node_id).toJS()
    const onClickHandler = (e) => {
      e.stopPropagation()
      d_lock(nodeSequence(), dims)
    }
    const onDoubleClickHandler = () => {
      d_setDisplayRoot(nodeSequence())
    }
    const onMouseOverHandler = () => {
      d_setFocus(nodeSequence(), dims, this.props.isLocked)
    }
    // #### perf bottleneck ####
    // when mouse go from IcicleRect to IcicleRect, trigger Out event => Hover event
    // d_setNoFocus trigger a redering of all the IcicleRect
    const onMouseOutHandler = () => {
      if (!this.props.isLocked) {
        d_setNoFocus()
      }
    }

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

    const res = [
      (<rect
        key='rect'
        className='node'
        x={dims.x}
        y={dims.y}
        width={dims.dx}
        height={dims.dy}
        onClick={onClickHandler}
        onDoubleClick={onDoubleClickHandler}
        onMouseOver={onMouseOverHandler}
        // onMouseOut={onMouseOutHandler}
        style={{'fill': fill, 'opacity': opacity}}
      />)
    ]

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
    getIDPath: database.getIDPath,
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
