import React from 'react'
import ReactDOM from 'react-dom'

import * as ObjectUtil from 'util/object-util'

import { ApiContext } from 'reducers/store'

import * as FunctionUtil from 'util/function-util'


class SvgRectangle extends React.PureComponent {
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
    const cursor = props.cursor

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
        style={{fill, opacity, stroke, cursor}}
      />
    )
  }
}


export default class IcicleRect extends React.PureComponent {
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

    const id = props.id

    props.registerDims(x,dx,y,dy,id)
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
      id:this.props.id,
      dims:this.dims,
    },e)
  }
  onDoubleClickHandler(e) {
    this.props.onDoubleClickHandler({
      id:this.props.id,
      dims:this.dims,
    },e)
  }
  onMouseOverHandler(e) {
    this.props.onMouseOverHandler({
      id:this.props.id,
      dims:this.dims,
    },e)
  }

  render() {
    const props = this.props

    const id = props.id
    const opacity = props.opacity

    const fill = this.props.fillColor(id)

    const x = props.x
    const dx = props.dx
    const y = props.y
    const dy = props.dy

    let cursor = 'pointer'
    if (props.onClickHandler === FunctionUtil.empty) {
      cursor = 'initial'
    }

    return (
      <g>
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
          cursor={cursor}
        />
      </g>
    )
  }
}
