import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setNoDisplayRoot, setNoFocus, unlock } from 'reducers/icicle-state'

import IcicleRect from 'components/icicle-rect'
import Ruler from 'components/ruler'
import BreadCrumbs from 'components/breadcrumbs'

import { animate, clear } from 'animation-daemon' 
import * as Color from 'color'

import { tr } from 'dict'



class Icicle extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  makeKey(id) {
    return 'icicle-display-root-'+id
  }

  removeRootId(arr) {
    return arr.slice(1)
  }

  render() {
    const x = 0
    let y = 0
    const width = this.props.dx
    let height = this.props.dy
    const trueFHeight = this.props.trueFHeight
    let id = this.props.root_id
    let display_root_components = []
    const display_root = this.removeRootId(this.props.display_root)

    if (display_root.length) {
      id = display_root.slice(-1)[0]
      display_root_components = display_root.map(node_id => {
        const x_node = x
        const y_node = y
        const dx_node = width
        const dy_node = trueFHeight(node_id)
        y += dy_node
        height -= dy_node

        return (
          <g key={this.makeKey(node_id)}>
            <IcicleRect
              node_id={node_id}
              x={x_node}
              y={y_node}
              dx={dx_node}
              dy={dy_node}
              fillColor={this.props.fillColor}
              nodeSequence={this.props.nodeSequence}
            />
          </g>
        )
      })
    }

    return (
      <g>
        {display_root_components}
        <IcicleRecursive
          x={x}
          y={y}
          width={width}
          height={height}
          id={id}
          fWidth={this.props.fWidth}
          normalizeWidth={this.props.normalizeWidth}
          trueFHeight={trueFHeight}
          getChildrenIdFromId={this.props.getChildrenIdFromId}
          fillColor={this.props.fillColor}
          nodeSequence={this.props.nodeSequence}
        />
      </g>
    )
  }
}


class IcicleRecursive extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  makeKey(id) {
    return 'icicle-recursive-'+id
  }

  computeCumulative(array) {
    const ans = [0]
    for (let i = 0; i < array.length - 1; i++) {
      ans.push(array[i] + ans[i])
    }
    return ans
  }


  render() {
    const children = this.props.getChildrenIdFromId(this.props.id)
    const children_width = this.props.normalizeWidth(children.map(this.props.fWidth))
      .map(a=>a*this.props.width)
    const cumulated_children_width = this.computeCumulative(children_width)

    const children_height = children.map(this.props.trueFHeight)

    const children_component = children.map((child_id,i) => {
      const x_child = this.props.x + cumulated_children_width[i]
      const width_child = children_width[i]
      const width_threshold = 1

      if (width_child < width_threshold) {
        return (<g key={this.makeKey(child_id)} />)
      }

      const y_child = this.props.y
      const height_child = children_height[i]

      const x_prime = x_child
      const width_prime = width_child
      const y_prime = y_child + height_child
      const height_prime = this.props.height - height_child
      return (
        <g key={this.makeKey(child_id)}>
          <IcicleRect
            node_id={child_id}
            x={x_child}
            y={y_child}
            dx={width_child}
            dy={height_child}
            fillColor={this.props.fillColor}
            nodeSequence={this.props.nodeSequence}
          />
          <IcicleRecursive
            x={x_prime}
            y={y_prime}
            width={width_prime}
            height={height_prime}
            id={child_id}
            fWidth={this.props.fWidth}
            normalizeWidth={this.props.normalizeWidth}
            trueFHeight={this.props.trueFHeight}
            getChildrenIdFromId={this.props.getChildrenIdFromId}
            fillColor={this.props.fillColor}
            nodeSequence={this.props.nodeSequence}
          />
        </g>
      )
    })

    return (
      <g>
        {children_component}
      </g>
    )
  }
}




class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      view_box_width:1000,
      view_box_height:300,
    }

    this.ref = this.ref.bind(this)


    this.getChildrenIdFromId = this.getChildrenIdFromId.bind(this)
    this.nodeSequence = this.nodeSequence.bind(this)
    this.fWidth = this.fWidth.bind(this)
    this.normalizeWidth = this.normalizeWidth.bind(this)
    this.trueFHeight = this.trueFHeight.bind(this)

    this.icicleWidth = this.icicleWidth.bind(this)
    this.icicleHeight = this.icicleHeight.bind(this)
    this.breadcrumbsWidth = this.breadcrumbsWidth.bind(this)
    this.rulerHeight = this.rulerHeight.bind(this)

    this.onClickHandler = this.onClickHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  icicleWidth() {
    return this.state.view_box_width*8/12
  }

  icicleHeight() {
    return this.state.view_box_height*8/12
  }

  breadcrumbsWidth() {
    return this.state.view_box_width - this.icicleWidth()
  }

  rulerHeight() {
    return this.state.view_box_height - this.icicleHeight()
  }

  ref(dom_element) {
    let animation_id
    if (dom_element) {
      const visible = () => true
      const measure = () => {
        try {
          const width = dom_element.width.baseVal.value
          const height = dom_element.height.baseVal.value
          this.setState({
            view_box_width: width,
            view_box_height: height,
          })
        } catch(e) {

        }
      }
      const mutate = () => {}

      animation_id = animate(visible,measure,mutate)
    } else {
      clear(animation_id)
    }
  }

  getChildrenIdFromId(id) {
    const node = this.props.getByID(id)
    return node.get('children').toJS()
  }

  nodeSequence(id) {
    return this.props.getIDPath(id).toJS()
  }

  fWidth(id) {
    const node = this.props.getByID(id)
    return node.get('content').get('size')
  }

  normalizeWidth(arr) {
    const sum = arr.reduce((a,b)=>a+b,0)
    const ans = arr.map(a=>a/sum)
    return ans
  }

  trueFHeight(id) {
    const icicle_height = this.icicleHeight()
    return icicle_height/this.props.max_depth
  }


  onClickHandler(e) {
    this.props.unlock()
    this.props.setNoFocus()
  }
  onMouseLeaveHandler(e) {
    if (!this.props.isLocked) {
      this.props.setNoFocus()
    }
  }

  render() {
    const view_box_width = this.state.view_box_width
    const view_box_height = this.state.view_box_height

    const icicle_width = this.icicleWidth()
    const icicle_height = this.icicleHeight()

    const breadcrumbs_width = this.breadcrumbsWidth()
    const ruler_height = this.rulerHeight()

    console.time('render icicle')
    const icicle = (
      <g style={{backgroundColor:'red'}}>
        <Icicle
          dx={icicle_width}
          dy={icicle_height}

          root_id={this.props.root_id}
          display_root={this.props.display_root}
          fWidth={this.fWidth}
          normalizeWidth={this.normalizeWidth}
          trueFHeight={this.trueFHeight}
          getChildrenIdFromId={this.getChildrenIdFromId}
          fillColor={this.props.fillColor}
          nodeSequence={this.nodeSequence}
        />

        <Ruler
          y={icicle_height}
          dx={icicle_width}
          dy={ruler_height}

          fillColor={this.props.fillColor}
        />

        <BreadCrumbs
          x={icicle_width}
          dx={breadcrumbs_width}

          trueFHeight={this.trueFHeight}
          fillColor={this.props.fillColor}
        />
      </g>
    )
    console.timeEnd('render icicle')


    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={'0 0 '+view_box_width+' '+view_box_height}
        width='100%'
        height='100%'
        preserveAspectRatio='xMidYMid meet'
        ref={this.ref}
        onClick={this.onClickHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <rect
          x={0}
          y={0}
          width={view_box_width}
          height={view_box_height}
          style={{'fill': 'antiquewhite',opacity:'0'}}
        />
        {icicle}
      </svg>
    )
  }
}

const mapStateToProps = state => {
  const database = selectDatabase(state)
  const icicle_state = selectIcicleState(state)


  const lock_sequence = icicle_state.lock_sequence()
  const isLocked = lock_sequence.length > 0

  return {
    getByID: database.getByID,
    root_id: database.rootId(),
    display_root: icicle_state.display_root(),
    getIDPath: database.getIDPath,
    max_depth: database.maxDepth(),
    isLocked,
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    unlock: (...args) => dispatch((unlock(...args))),
    setNoDisplayRoot: (...args) => dispatch(setNoDisplayRoot(...args))
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container