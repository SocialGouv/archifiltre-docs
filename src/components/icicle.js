import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState, commit } from 'reducers/root-reducer'

import { setDisplayRoot, setNoDisplayRoot, setFocus, setNoFocus, lock, unlock } from 'reducers/icicle-state'

import IcicleRect from 'components/icicle-rect'
import Ruler from 'components/ruler'
import BreadCrumbs from 'components/breadcrumbs'

import { generateRandomString } from 'random-gen'

import MinimapBracket from 'components/minimap-bracket'

import { animate, clear } from 'animation-daemon' 
import * as Color from 'color'

import { tr } from 'dict'

const nothing = ()=>{}

function computeCumulative(array) {
  const ans = [0]
  for (let i = 0; i < array.length - 1; i++) {
    ans.push(array[i] + ans[i])
  }
  return ans
}

class AnimatedIcicle extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      prevStyle:{
        display:'none',
      },
      prevProps:props,
    }

    this.onIcicleRectDoubleClickHandler = this.onIcicleRectDoubleClickHandler.bind(this)


    this.ref = this.ref.bind(this)

    this.ani = this.ani.bind(this)

  }

  onIcicleRectDoubleClickHandler(props,event) {
    this.setState({
      prevProps:this.props,
      prevStyle:{
        display:'inherit',
      }
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


      Promise.all([
        this.ani(prev_dom_element,false,target_x,target_dx,x,dx),
        this.ani(dom_element,true,x,dx,target_x,target_dx),
      ]).then(() => {
          this.setState({
            prevStyle:{
              display:'none',
            }
          })
        })
    })
  }


  ani(dom_element,inv,target_x,target_dx,x,dx) {
    return new Promise((resolve,reject) => {
      const state = this.state
      const getTime = () => new Date().getTime()
      const init_time = getTime()
      const target_time = 1000
      const zeroToOne = () => {
        const current_time = getTime()
        return Math.min(1, (current_time-init_time)/target_time)
      }

      let animation_id
      // [translateX, scaleX, opacity]

      const init = [0,1,1]
      const target = [target_x - x, target_dx / dx, 0]

      if (target_x === 0) {
        target[0] = target[0] * target[1]
      }

      let vector = init.map((val,i)=>a=>val+(target[i]-val)*a)
      if (inv) {
        vector = target.map((val,i)=>a=>val+(init[i]-val)*a)
      }

      const visible = () => true
      const measure = () => {}
      const mutate = () => {
        const zero_to_one = zeroToOne()
        let translate_x = vector[0](zero_to_one)
        let scale_x = vector[1](zero_to_one)
        let opacity = vector[2](zero_to_one)

        dom_element.style.willChange = 'transform, opacity'
        dom_element.style.transform = `translateX(${translate_x}px) scaleX(${scale_x})`
        dom_element.style.opacity = opacity
        
        if (zero_to_one >= 1) {
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
    const prevStyle = state.prevStyle

    const ref = this.ref
    const prevRef = this.prevRef

    const svg_id = generateRandomString(40)

    return (
      <g clipPath={'url(#'+svg_id+')'}>
        <defs>
          <clipPath id={svg_id}>
            <rect x={x} y={y} width={dx} height={dy}/>
          </clipPath>
        </defs>

        <g ref={ref}>
          <g style={prevStyle}>
            <Icicle {...prevProps}/>
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
    const props = this.props

    const x = props.x
    const y = props.y
    const dx = props.dx
    const dy = props.dy

    const display_root = props.display_root
    const [xc,dxc] = props.computeWidthRec(display_root,x,dx)

    let x_prime = (x + (x - xc)) * (dx / dxc)
    let dx_prime = dx * (dx / dxc)

    if (Number.isNaN(x_prime)) {
      x_prime = 0
    }

    if (Number.isNaN(dx_prime)) {
      dx_prime = 0
    }


    const root_id = props.root_id
    const trueFHeight = this.trueFHeight

    return (
       <g>
        <IcicleRecursive
          x={x_prime}
          y={y}
          width={dx_prime}
          height={dy}
          id={root_id}
          fWidth={props.fWidth}
          normalizeWidth={props.normalizeWidth}
          trueFHeight={trueFHeight}
          getChildrenIdFromId={props.getChildrenIdFromId}
          fillColor={props.fillColor}
          shouldRenderChild={props.shouldRenderChild}

          onIcicleRectClickHandler={props.onIcicleRectClickHandler}
          onIcicleRectDoubleClickHandler={props.onIcicleRectDoubleClickHandler}
          onIcicleRectMouseOverHandler={props.onIcicleRectMouseOverHandler}
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



  render() {
    const children = this.props.getChildrenIdFromId(this.props.id)
    const children_width = this.props.normalizeWidth(children.map(this.props.fWidth))
      .map(a=>a*this.props.width)
    const cumulated_children_width = computeCumulative(children_width)

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
    this.computeWidthRec = this.computeWidthRec.bind(this)
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

  computeWidthRec(ids, x, dx) {
    if (ids.length < 2) {
      return [x, dx]
    } else {
      const fWidth = this.fWidth
      const normalizeWidth = this.normalizeWidth
      const getChildrenIdFromId = this.getChildrenIdFromId

      const parent_id = ids[0]
      const child_id = ids[1]
      ids = ids.slice(1)

      const children_ids = getChildrenIdFromId(parent_id)
      const width_array = normalizeWidth(children_ids.map(fWidth)).map(a=>a*dx)
      const cumulated_width_array = computeCumulative(width_array)

      const index_of = children_ids.indexOf(child_id)
      x = cumulated_width_array[index_of] + x
      dx = width_array[index_of]

      return this.computeWidthRec(ids, x, dx)
    }
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
    const dx_window = this.icicleWidth() - 1

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
        
          computeWidthRec={this.computeWidthRec}
        />

        <Ruler
          x={0}
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

            computeWidthRec={this.computeWidthRec}
          />
          <MinimapBracket
            x={minimap_x+5}
            y={minimap_y+5}
            dx={minimap_width-10}
            dy={minimap_height-10}

            display_root={this.props.display_root}
            computeWidthRec={this.computeWidthRec}
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
        
