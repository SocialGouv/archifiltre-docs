import React from 'react'
import ReactDOM from 'react-dom'

import * as ObjectUtil from 'util/object-util'

import { ApiContext } from 'reducers/store'


class SvgRectangle extends React.PureComponent {
  // shouldComponentUpdate(nextProps, nextState) {
  //   let ans = true
  //   let logs = []
  //   for (let key in this.props) {
  //     ans = ans && this.props[key] === nextProps[key]
  //     if (this.props[key] !== nextProps[key]) {
  //       console.log(key,this.props[key],nextProps[key])
  //       logs.push(key)
  //     }
  //   }
  //   if (!ans) {
  //     // console.log(ans, logs)
  //   }
  //   return !ans
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
    const fill = props.fill
    const opacity = props.opacity
    const stroke = props.stroke

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
        style={{fill, opacity, stroke}}
      />
    )
  }
}


class IcicleRect extends React.PureComponent {
  constructor(props) {
    super(props)

    this.register = this.register.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)

    this.dims = this.dims.bind(this)

    this.onClickHandler = this.onClickHandler.bind(this)
    this.onDoubleClickHandler = this.onDoubleClickHandler.bind(this)
    this.onMouseOverHandler = this.onMouseOverHandler.bind(this)
  }

  register() {
    const props = this.props

    const x = props.x
    const dx = props.dx
    const y = props.y
    const dy = props.dy

    const node_id = props.node_id

    props.registerDims(x,dx,y,dy,node_id)
  }

  componentDidMount() {
    this.register()
  }

  componentDidUpdate() {
    this.register()
  }

  dims() {
    return {
      x:this.props.x,
      y:this.props.y,
      dx:this.props.dx,
      dy:this.props.dy,
    }
  }

  onClickHandler(e) {
    this.props.onClickHandler({
      id:this.props.node_id,
      dims:this.dims,
    },e)
  }
  onDoubleClickHandler(e) {
    this.props.onDoubleClickHandler({
      id:this.props.node_id,
      dims:this.dims,
    },e)
  }
  onMouseOverHandler(e) {
    this.props.onMouseOverHandler({
      id:this.props.node_id,
      dims:this.dims,
    },e)
  }

  render() {
    const props = this.props
    const node_id = props.node_id

    const isLocked = props.isLocked
    const isFocused = props.isFocused
    const isInHoverSeq = props.isInHoverSeq
    const isInLockSeq = props.isInLockSeq

    const opacity = props.opacity

    const fill = this.props.fillColor(node_id)

    const x = props.x
    const dx = props.dx
    const y = props.y
    const dy = props.dy

    const zero = [
      <SvgRectangle
        key='rect'
        x={x}
        y={y}
        dx={dx}
        dy={dy}
        onClickHandler={this.onClickHandler}
        onDoubleClickHandler={this.onDoubleClickHandler}
        onMouseOverHandler={this.onMouseOverHandler}
        fill={fill}
        opacity={opacity}
        stroke={'#fff'}
      />
    ]


    if(this.props.hasTags) {
      const stroke_opacity = this.props.highlightingATag ? (this.props.hasTagToHighlight ? 1 : 0.2) : 1

      zero.push(
        (<rect
            key='stroke'
            x={this.props.x + 1}
            y={this.props.y + 1}
            width={this.props.dx - 2}
            height='6'
            style={{'fill': 'rgb(10, 50, 100)', 'stroke':'none', 'opacity':stroke_opacity}}
          />
        )
      )
    }

    return (
      <g>
        {zero}
      </g>
    )
  }
}


// Bottleneck !!!!!!!!!!!!!!!
import { List } from 'immutable' //////////////////////////////////

export default (props) => {
  const hover_sequence = []
  const lock_sequence = []
  const tag_id_to_highlight = ''

  const node_tag_ids = List()


  // const icicle_state = api.icicle_state
  // const database = api.database

  // const hover_sequence = icicle_state.hover_sequence()
  // const lock_sequence = icicle_state.lock_sequence()
  // const tag_id_to_highlight = icicle_state.tagIdToHighlight()

  // const node_tag_ids = database.getTagIdsByFfId(props.node_id)

  const isInHoverSeq = hover_sequence.includes(props.id)
  const isInLockSeq = lock_sequence.includes(props.id)
  const hasTags = node_tag_ids.size > 0
  const highlightingATag = tag_id_to_highlight.length > 0
  const hasTagToHighlight = node_tag_ids.includes(tag_id_to_highlight)


  props = ObjectUtil.compose({
    node_id:props.id,


    isFocused: false,
    isLocked: false,
    // isFocused: icicle_state.isFocused(),
    // isLocked: icicle_state.isLocked(),
    isInHoverSeq,
    isInLockSeq,
    hasTags,
    highlightingATag,
    hasTagToHighlight,
  },props)


  return (<IcicleRect {...props}/>)
    
}

