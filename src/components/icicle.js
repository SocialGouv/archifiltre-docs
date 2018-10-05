import React from 'react'


import IcicleRect from 'components/icicle-rect'
import Ruler from 'components/ruler'
import BreadCrumbs from 'components/breadcrumbs'

import { generateRandomString } from 'random-gen'

import MinimapBracket from 'components/minimap-bracket'

import { animate, clear } from 'animation-daemon' 
import * as Color from 'color'

import * as ObjectUtil from 'util/object-util'


import * as ArrayUtil from 'util/array-util'
import * as FunctionUtil from 'util/function-util'

import IcicleRecursive from 'components/icicle-recursive'

import { updateIn } from 'immutable'

import IcicleTags from 'components/icicle-tags'




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
            {prevStyle.display !== 'none' &&
               <Icicle {...prevProps}/>
            }
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

    this.state = {
      dims:{},
    }

    this.registerDims = this.registerDims.bind(this)
    this.shouldResetDims = false

    this.trueFHeight = this.trueFHeight.bind(this)

    this.arrayOfIdToComponents = this.arrayOfIdToComponents.bind(this)
  }


  registerDims(x,dx,y,dy,id) {
    if (this.shouldResetDims) {
      this.setState({dims:{}})
      this.shouldResetDims = false
    }
    this.setState(state=>updateIn(state,['dims',id],()=>{return{x,dx,y,dy}}))
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

  arrayOfIdToComponents(key_prefix,opacity,array_of_id) {
    if (array_of_id.length) {
      const props = this.props

      const onClickHandler = props.onIcicleRectClickHandler
      const onDoubleClickHandler = props.onIcicleRectDoubleClickHandler
      const onMouseOverHandler = props.onIcicleRectMouseOverHandler

      const fillColor = props.fillColor

      const state = this.state

      const array_of_id_without_root_id = array_of_id.slice(1)
      return array_of_id_without_root_id.map(id=>{
        const dims = state.dims[id]
        if (dims === undefined) {
          return (<g key={key_prefix+id}/>)
        }
        const x = dims.x
        const dx = dims.dx
        const y = dims.y
        const dy = dims.dy

        return (
          <IcicleRect
            key={key_prefix+id}
            id={id}
            x={x}
            y={y}
            dx={dx}
            dy={dy}

            opacity={opacity}

            fillColor={fillColor}

            onClickHandler={onClickHandler}
            onDoubleClickHandler={onDoubleClickHandler}
            onMouseOverHandler={onMouseOverHandler}

            registerDims={FunctionUtil.empty}
          />
        )
      })
    } else {
      return []
    }
  }

  render() {
    this.shouldResetDims = true
    
    const props = this.props

    const root_id = props.root_id
    const x = props.x
    const y = props.y
    const dx = props.dx
    const dy = props.dy

    const display_root = props.display_root
    const computeWidthRec = props.computeWidthRec

    const fWidth = props.fWidth
    const normalizeWidth = props.normalizeWidth
    const getChildrenIdFromId = props.getChildrenIdFromId

    const shouldRenderChild = props.shouldRenderChild

    const onClickHandler = props.onIcicleRectClickHandler
    const onDoubleClickHandler = props.onIcicleRectDoubleClickHandler
    const onMouseOverHandler = props.onIcicleRectMouseOverHandler



    const fillColor = props.fillColor


    const trueFHeight = this.trueFHeight
    const registerDims = this.registerDims
    const arrayOfIdToComponents = this.arrayOfIdToComponents


    const [xc,dxc] = computeWidthRec(display_root,x,dx).slice(-1)[0]

    let x_prime = (x + (x - xc)) * (dx / dxc)
    let dx_prime = dx * (dx / dxc)

    if (Number.isNaN(x_prime)) {
      x_prime = 0
    }

    if (Number.isNaN(dx_prime)) {
      dx_prime = 0
    }



    const api = this.props.api
    const icicle_state = api.icicle_state

    let style = {}
    if (icicle_state.isFocused() || icicle_state.isLocked()) {
      style.opacity = 0.3
    }

    const sequence = icicle_state.sequence()
    const sequence_components = arrayOfIdToComponents('sequence',1,sequence)

    const hover = icicle_state.hover_sequence()
    const hover_components = arrayOfIdToComponents('hover',0.3,hover)


    const database = api.database
    const tag_ids = database.getAllTagIds()
    const getTagByTagId = database.getTagByTagId
    const dims = this.state.dims
    const tag_id_to_highlight = icicle_state.tagIdToHighlight()

    return (
      <g>
        <g style={style}>
          <IcicleRecursive
            x={x_prime}
            y={y}
            width={dx_prime}
            height={dy}
            id={root_id}

            fWidth={fWidth}
            normalizeWidth={normalizeWidth}
            trueFHeight={trueFHeight}
            getChildrenIdFromId={getChildrenIdFromId}

            shouldRenderChild={shouldRenderChild}
            fillColor={fillColor}
            onClickHandler={onClickHandler}
            onDoubleClickHandler={onDoubleClickHandler}
            onMouseOverHandler={onMouseOverHandler}

            registerDims={registerDims}
          />
        </g>
        {hover_components}
        {sequence_components}
        <IcicleTags
          tag_ids={tag_ids}
          getTagByTagId={getTagByTagId}
          dims={dims}
          tag_id_to_highlight={tag_id_to_highlight}
          onClick={onClickHandler}
          onDoubleClick={onDoubleClickHandler}
          onMouseOver={onMouseOverHandler}
        />
      </g>
    )
  }
}




class IcicleMainComponent extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      view_box_width:1000,
      view_box_height:300,
    }

    this.responsiveAnimation = this.responsiveAnimation.bind(this)

    this.ref = this.ref.bind(this)

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


  // componentDidUpdate(prevProps, prevState) {
  //   const ans = {}
  //   for (let key in this.props) {
  //     if (prevProps[key] !== this.props[key]) {
  //       ans[key] = [prevProps[key], this.props[key]]
  //     }
  //   }
  //   if (Object.keys(ans).length > 0) {
  //     console.log(ans)
  //   }
  // }


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


  computeWidthRec(ids, x, dx) {
    const ans = [[x, dx]]
    if (ids.length < 2) {
      return ans
    } else {
      const fWidth = this.fWidth
      const normalizeWidth = this.normalizeWidth
      const getChildrenIdFromId = this.props.getChildrenIdFromId

      const parent_id = ids[0]
      const child_id = ids[1]
      ids = ids.slice(1)

      const children_ids = getChildrenIdFromId(parent_id)
      const width_array = normalizeWidth(children_ids.map(fWidth)).map(a=>a*dx)
      const cumulated_width_array = ArrayUtil.computeCumulative(width_array)

      const index_of = children_ids.indexOf(child_id)
      x = cumulated_width_array[index_of] + x
      dx = width_array[index_of]

      return ans.concat(this.computeWidthRec(ids, x, dx))
    }
  }


  fWidth(id) {
    const node = this.props.getFfByFfId(id)
    return node.get('size')
  }

  normalizeWidth(arr) {
    const sum = arr.reduce((a,b)=>a+b,0)
    const ans = arr.map(a=>a/sum)
    return ans
  }

  trueFHeight(height, id) {
    return height/this.props.max_depth
  }

  shouldRenderChildIcicle(x,dx,id) {
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

  shouldRenderChildMinimap(x,dx,id) {
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
    return this.props.getFfIdPath(id).toJS()
  }

  onIcicleRectClickHandler(props,event) {
    event.stopPropagation()
    const node_id = props.id
    const dims = props.dims()

    const node_sequence = this.nodeSequence(node_id)
    this.props.lock(node_sequence, dims)
  }
  onIcicleRectDoubleClickHandler(props,event) {
    const node_id = props.id

    const node_sequence = this.nodeSequence(node_id)
    this.props.setDisplayRoot(node_sequence)
  }
  onIcicleRectMouseOverHandler(props,event) {
    const node_id = props.id
    const dims = props.dims()

    const node_sequence = this.nodeSequence(node_id)
    this.props.setFocus(node_sequence, dims)
  }


  render() {
    const api = this.props.api
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
          api={api}
          x={0}
          y={0}
          dx={icicle_width}
          dy={icicle_height}

          root_id={this.props.root_id}
          display_root={this.props.display_root}
          fWidth={this.fWidth}
          normalizeWidth={this.normalizeWidth}
          trueFHeight={this.trueFHeight}
          getChildrenIdFromId={this.props.getChildrenIdFromId}
          fillColor={this.props.fillColor}

          sequence={this.props.sequence}
          hover_sequence={this.props.hover_sequence}

          shouldRenderChild={this.shouldRenderChildIcicle}

          onIcicleRectClickHandler={this.onIcicleRectClickHandler}
          onIcicleRectDoubleClickHandler={this.onIcicleRectDoubleClickHandler}
          onIcicleRectMouseOverHandler={this.onIcicleRectMouseOverHandler}
        
          computeWidthRec={this.computeWidthRec}
        />

        <Ruler
          api={api}
          x={0}
          y={icicle_height}
          dx={icicle_width}
          dy={ruler_height}

          fillColor={this.props.fillColor}
        />

        <BreadCrumbs
          api={api}
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
            api={api}

            x={minimap_x+5}
            y={minimap_y+5}
            dx={minimap_width-10}
            dy={minimap_height-10}

            root_id={this.props.root_id}
            display_root={ArrayUtil.empty}
            fWidth={this.fWidth}
            normalizeWidth={this.normalizeWidth}
            trueFHeight={this.trueFHeight}
            getChildrenIdFromId={this.props.getChildrenIdFromId}
            fillColor={this.props.fillColor}

            sequence={this.props.sequence}
            hover_sequence={this.props.hover_sequence}

            shouldRenderChild={this.shouldRenderChildMinimap}

            onIcicleRectClickHandler={FunctionUtil.empty}
            onIcicleRectDoubleClickHandler={FunctionUtil.empty}
            onIcicleRectMouseOverHandler={FunctionUtil.empty}

            computeWidthRec={this.computeWidthRec}
          />
          <MinimapBracket
            x={minimap_x+5}
            y={minimap_y+5}
            dx={minimap_width-10}
            dy={minimap_height-10}

            display_root={this.props.display_root}
            computeWidthRec={this.computeWidthRec}

            fillColor={this.props.fillColor}
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


export default function IcicleApiToProps(props) {
  const api = props.api
  const icicle_state = api.icicle_state
  const database = api.database

  const lock_sequence = icicle_state.lock_sequence()
  const isLocked = lock_sequence.length > 0

  props = ObjectUtil.compose({
    getFfByFfId: database.getFfByFfId,
    root_id: database.rootFfId(),
    display_root: icicle_state.display_root(),
    getFfIdPath: database.getFfIdPath,
    max_depth: database.maxDepth(),
    isLocked,
    sequence: icicle_state.sequence(),
    hover_sequence: icicle_state.hover_sequence(),

    setFocus: icicle_state.setFocus,
    setNoFocus: icicle_state.setNoFocus,
    lock: (...args) => {
      icicle_state.lock(...args)
      api.undo.commit()
    },
    unlock: icicle_state.unlock,
    setDisplayRoot: icicle_state.setDisplayRoot,
  },props)

  return (<IcicleMainComponent {...props}/>)
}

