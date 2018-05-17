import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setFocus, setNoFocus, setDisplayRoot, setNoDisplayRoot, lock } from 'reducers/icicle-state'

import { typeOf } from 'components/icicle'

import { mkDummyParent } from 'table-tree'
import { commit } from 'reducers/root-reducer'

import { tr } from 'dict'

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

    const display = this.props.node.get('depth') ? "" : "none"
    const is_parent = this.props.isZoomed && this.props.display_root.includes(this.props.node_id) && this.props.node.get('children').size
    const fill = is_parent ? typeOf(mkDummyParent()).color : typeOf(this.props.node).color

    const res = [
      (<rect
        key="rect"
        className="node"
        x={dims.x}
        y={dims.y}
        width={dims.dx}
        height={dims.dy}
        onClick={onClickHandler}
        onDoubleClick={onDoubleClickHandler}
        onMouseOver={onMouseOverHandler}
        // onMouseOut={onMouseOutHandler}
        style={{"fill": fill, "opacity": opacity, "display" : display}}
      />)
    ]

    if (!(this.props.node.get('depth')) && this.props.isZoomed) {
      res.push(
        <rect
          x={dims.dx/3}
          y="0"
          rx="1em"
          ry="1em"
          width={dims.dx/3}
          height={dims.dy*3/4}
          stroke="none"
          fill={typeOf(mkDummyParent()).color}
          onClick={(e) => {e.stopPropagation(); d_setNoDisplayRoot() ; d_setNoFocus() ;}}
          key="button"
        />
      )

      res.push(
        <text
          x={dims.dx/2}
          y={dims.dy/2}
          dx="0"
          dy="0"
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="0.05em"
          stroke="none"
          fill="white"
          onClick={(e) => {e.stopPropagation(); d_setNoDisplayRoot() ; d_setNoFocus() ;}}
          key="text">{tr("Back to root")}
        </text>
      )
    }


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
    node: database.getByID(props.node_id),
    display_root: icicle_state.display_root(),
    isZoomed: icicle_state.isZoomed(),
    isFocused: icicle_state.isFocused(),
    isLocked: icicle_state.isLocked(),
    isInHoverSeq,
    isInLockSeq,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // setFocus: (...args) => dispatch((setFocus(...args))),
    // setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    // setDisplayRoot: (...args) => dispatch((setDisplayRoot(...args))),
    // setNoDisplayRoot: (...args) => dispatch((setNoDisplayRoot(...args))),
    // lock: (...args) => {
    //   dispatch((lock(...args)))
    //   dispatch(commit())
    // }
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
