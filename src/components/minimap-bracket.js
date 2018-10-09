import React from 'react'


class MinimapBracket extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const props = this.props

    const x = props.x
    const y = props.y
    const dx = props.dx
    const dy = props.dy
    const display_root = props.display_root
    const computeWidthRec = props.computeWidthRec

    if (display_root.length) {
      const ids = display_root
      let [minimap_x, minimap_width] = computeWidthRec(ids,x,dx).slice(-1)[0]

      minimap_width = Math.max(minimap_width,1)

      return (
        <g>
          <rect
            x={x}
            y={y}
            width={minimap_x-x}
            height={dy}
            style={{'fill': 'black', opacity:'0.4'}}
          />
          <rect
            x={minimap_x+minimap_width}
            y={y}
            width={x+dx - (minimap_x+minimap_width)}
            height={dy}
            style={{'fill': 'black', opacity:'0.4'}}
          />
        </g>
      )
    } else {
      return (
        <g/>
      )
    }
  }
}

export default MinimapBracket
