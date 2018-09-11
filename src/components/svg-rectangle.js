
import React from 'react'

export default class SvgRectangle extends React.PureComponent {
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
