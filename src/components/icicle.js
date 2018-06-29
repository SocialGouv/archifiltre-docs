import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState, commit } from 'reducers/root-reducer'

import { setDisplayRoot, setNoDisplayRoot, setFocus, setNoFocus, lock, unlock } from 'reducers/icicle-state'

import IcicleRect from 'components/icicle-rect'
import Ruler from 'components/ruler'
import BreadCrumbs from 'components/breadcrumbs'

import MinimapBracket from 'components/minimap-bracket'

import { animate, clear } from 'animation-daemon' 
import * as Color from 'color'

import { tr } from 'dict'

const nothing = ()=>{}

class AnimatedIcicle extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {}

    this.onIcicleRectDoubleClickHandler = this.onIcicleRectDoubleClickHandler.bind(this)


    this.ref = this.ref.bind(this)

    this.ani = this.ani.bind(this)

  }

  onIcicleRectDoubleClickHandler(props,event) {
    this.setState({
      prevProps:this.props,
    }, () => {
      this.props.onIcicleRectDoubleClickHandler(props,event)

      const target_x = this.props.x
      const target_dx = this.props.dx

      const dims = props.dims()
      const x = dims.x
      const dx = dims.dx

      const children = this.state.dom_element.children
      const prev_dom_element = children[0]
      const dom_element = children[1]

      console.log(children)

      Promise.all([
        this.ani(prev_dom_element,false,target_x,target_dx,x,dx),
        this.ani(dom_element,true,x,dx,target_x,target_dx),
      ]).then(() => {
          this.setState({
            prevProps:undefined,
          })
        })
    })


  }


  ani(dom_element,inv,target_x,target_dx,x,dx) {
    return new Promise((resolve,reject) => {
      const state = this.state

      let animation_id
      let nb_loop = 20

      const init_translate_x = 0
      const init_scale_x = 1
      const init_opacity = 1

      const target_scale_x = target_dx / dx
      let target_translate_x = (target_x - x)
      if (target_x < x) {
        target_translate_x = target_translate_x * target_scale_x
      }
      // const target_translate_x = (target_x - x) * target_scale_x
      const target_opacity = 0

      const translate_x_inc = (target_translate_x - init_translate_x) / nb_loop
      const scale_x_inc = (target_scale_x - init_scale_x) / nb_loop
      const opacity_inc = (target_opacity - init_opacity) / nb_loop

      let translate_x = init_translate_x
      let scale_x = init_scale_x
      let opacity = init_opacity
      let f = (a,b) => a+b

      if (inv) {
        translate_x = target_translate_x
        scale_x = target_scale_x
        opacity = target_opacity
        f = (a,b) => a-b
      }

      const visible = () => true
      const measure = () => {}
      const mutate = () => {
        if (nb_loop) {
          translate_x = f(translate_x, translate_x_inc)
          scale_x = f(scale_x, scale_x_inc)
          opacity = f(opacity, opacity_inc)
          nb_loop--

          // console.log(translate_x,scale_x)

          dom_element.style.willChange = 'transform, opacity'
          dom_element.style.transform = `translateX(${translate_x}px) scaleX(${scale_x})`
          dom_element.style.opacity = opacity
        } else {
          dom_element.style.willChange = 'unset'
          clear(animation_id)
          resolve()
        }
      }

      animation_id = animate(visible,measure,mutate)
    })
  }

  ref(dom_element) {
    this.setState({
      dom_element,
    })
  }

  render() {
    const props = this.props

    const x = props.x
    const y = props.y
    const dx = props.dx
    const dy = props.dy

    const state = this.state
    const prevProps = state.prevProps
    // const styles = state.styles
    // const props_array = state.props_array

    const ref = this.ref
    const prevRef = this.prevRef

    return (
      <g clipPath='url(#icicle-clip)'>
        <defs>
          <clipPath id='icicle-clip'>
            <rect x={x} y={y} width={dx} height={dy}/>
          </clipPath>
        </defs>


        <g ref={ref}>
          <g>
            {prevProps && <Icicle {...prevProps}/>}
          </g>
          <g>
            <Icicle
              {...props}
              onIcicleRectDoubleClickHandler={this.onIcicleRectDoubleClickHandler}
            />
          </g>
        </g>
        
      </g>
    )
  }
}


class Icicle extends React.PureComponent {
  constructor(props) {
    super(props)

    this.trueFHeight = this.trueFHeight.bind(this)
  }

  makeKey(id) {
    return 'icicle-display-root-'+id
  }

  removeRootId(arr) {
    return arr.slice(1)
  }

  trueFHeight(id) {
    const height = this.props.dy
    return this.props.trueFHeight(height, id)
  }

  render() {
    const x = this.props.x
    let y = this.props.y
    const width = this.props.dx
    let height = this.props.dy
    const trueFHeight = this.trueFHeight
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

              onClickHandler={this.props.onIcicleRectClickHandler}
              onDoubleClickHandler={this.props.onIcicleRectDoubleClickHandler}
              onMouseOverHandler={this.props.onIcicleRectMouseOverHandler}
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
          shouldRenderChild={this.props.shouldRenderChild}

          onIcicleRectClickHandler={this.props.onIcicleRectClickHandler}
          onIcicleRectDoubleClickHandler={this.props.onIcicleRectDoubleClickHandler}
          onIcicleRectMouseOverHandler={this.props.onIcicleRectMouseOverHandler}
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

      const should_render_child = this.props.shouldRenderChild(x_child, width_child)

      if (should_render_child === false) {
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

            onClickHandler={this.props.onIcicleRectClickHandler}
            onDoubleClickHandler={this.props.onIcicleRectDoubleClickHandler}
            onMouseOverHandler={this.props.onIcicleRectMouseOverHandler}
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
            shouldRenderChild={this.props.shouldRenderChild}

            onIcicleRectClickHandler={this.props.onIcicleRectClickHandler}
            onIcicleRectDoubleClickHandler={this.props.onIcicleRectDoubleClickHandler}
            onIcicleRectMouseOverHandler={this.props.onIcicleRectMouseOverHandler}
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

    this.responsiveAnimation = this.responsiveAnimation.bind(this)

    this.ref = this.ref.bind(this)

    this.getChildrenIdFromId = this.getChildrenIdFromId.bind(this)
    this.fWidth = this.fWidth.bind(this)
    this.normalizeWidth = this.normalizeWidth.bind(this)
    this.trueFHeight = this.trueFHeight.bind(this)

    this.icicleWidth = this.icicleWidth.bind(this)
    this.icicleHeight = this.icicleHeight.bind(this)
    this.breadcrumbsWidth = this.breadcrumbsWidth.bind(this)
    this.rulerHeight = this.rulerHeight.bind(this)

    this.onClickHandler = this.onClickHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)

    this.shouldRenderChildIcicle = this.shouldRenderChildIcicle.bind(this)
    this.shouldRenderChildMinimap = this.shouldRenderChildMinimap.bind(this)

    this.nodeSequence = this.nodeSequence.bind(this)

    this.onIcicleRectClickHandler = this.onIcicleRectClickHandler.bind(this)
    this.onIcicleRectDoubleClickHandler = this.onIcicleRectDoubleClickHandler.bind(this)
    this.onIcicleRectMouseOverHandler = this.onIcicleRectMouseOverHandler.bind(this)
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

  responsiveAnimation(dom_element) {
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

  ref(dom_element) {
    this.responsiveAnimation(dom_element)
  }

  getChildrenIdFromId(id) {
    const node = this.props.getByID(id)
    return node.get('children').toJS()
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

  trueFHeight(height, id) {
    return height/this.props.max_depth
  }

  shouldRenderChildIcicle(x,dx) {
    const dx_threshold = 1
    const x_window = 0
    const dx_window = this.icicleWidth()

    if (x + dx < x_window || x_window + dx_window < x) {
      return false
    } else {
      if (dx < dx_threshold) {
        return false
      } else {
        return true
      }
    }
  }

  shouldRenderChildMinimap(x,dx) {
    const dx_threshold = 2.5

    if (dx < dx_threshold) {
      return false
    } else {
      return true
    }
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


  nodeSequence(id) {
    return this.props.getIDPath(id).toJS()
  }

  onIcicleRectClickHandler(props,event) {
    event.stopPropagation()
    const node_id = props.node_id
    const dims = props.dims

    const node_sequence = this.nodeSequence(node_id)
    this.props.lock(node_sequence, dims())
  }
  onIcicleRectDoubleClickHandler(props,event) {
    const node_id = props.node_id

    const node_sequence = this.nodeSequence(node_id)
    this.props.setDisplayRoot(node_sequence)
  }
  onIcicleRectMouseOverHandler(props,event) {
    const node_id = props.node_id
    const dims = props.dims
    const isLocked = props.isLocked

    const node_sequence = this.nodeSequence(node_id)
    this.props.setFocus(node_sequence, dims(), isLocked)
  }


  render() {
    const view_box_width = this.state.view_box_width
    const view_box_height = this.state.view_box_height

    const icicle_width = this.icicleWidth()
    const icicle_height = this.icicleHeight()

    const breadcrumbs_width = this.breadcrumbsWidth()
    const ruler_height = this.rulerHeight()

    const minimap_x = icicle_width+30
    const minimap_y = icicle_height+10
    const minimap_width = breadcrumbs_width-30
    const minimap_height = ruler_height-20

    console.time('render icicle')
    const icicle = (
      <g>
        <AnimatedIcicle
          x={0}
          y={0}
          dx={icicle_width}
          dy={icicle_height}

          root_id={this.props.root_id}
          display_root={this.props.display_root}
          fWidth={this.fWidth}
          normalizeWidth={this.normalizeWidth}
          trueFHeight={this.trueFHeight}
          getChildrenIdFromId={this.getChildrenIdFromId}
          fillColor={this.props.fillColor}

          shouldRenderChild={this.shouldRenderChildIcicle}

          onIcicleRectClickHandler={this.onIcicleRectClickHandler}
          onIcicleRectDoubleClickHandler={this.onIcicleRectDoubleClickHandler}
          onIcicleRectMouseOverHandler={this.onIcicleRectMouseOverHandler}
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
          dy={icicle_height}

          trueFHeight={this.trueFHeight}
          fillColor={this.props.fillColor}
        />

        <g>
          <rect
            x={minimap_x}
            y={minimap_y}
            width={minimap_width}
            height={minimap_height}
            // rx='10' ry='10'
            style={{'fill': 'white', opacity:'0.4'}}
          />
          <Icicle
            x={minimap_x+5}
            y={minimap_y+5}
            dx={minimap_width-10}
            dy={minimap_height-10}

            root_id={this.props.root_id}
            display_root={[]}
            fWidth={this.fWidth}
            normalizeWidth={this.normalizeWidth}
            trueFHeight={this.trueFHeight}
            getChildrenIdFromId={this.getChildrenIdFromId}
            fillColor={this.props.fillColor}

            shouldRenderChild={this.shouldRenderChildMinimap}

            onIcicleRectClickHandler={nothing}
            onIcicleRectDoubleClickHandler={nothing}
            onIcicleRectMouseOverHandler={nothing}
          />
          <MinimapBracket
            x={minimap_x+5}
            y={minimap_y+5}
            dx={minimap_width-10}
            dy={minimap_height-10}

            display_root={this.props.display_root}
            fWidth={this.fWidth}
            normalizeWidth={this.normalizeWidth}
            getChildrenIdFromId={this.getChildrenIdFromId}
          />
        </g>
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
    setFocus: (...args) => dispatch((setFocus(...args))),
    setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    lock: (...args) => {
      dispatch((lock(...args)))
      dispatch(commit())
    },
    unlock: (...args) => dispatch((unlock(...args))),
    setDisplayRoot: (...args) => dispatch(setDisplayRoot(...args)),
    setNoDisplayRoot: (...args) => dispatch(setNoDisplayRoot(...args)),
  }
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
        
