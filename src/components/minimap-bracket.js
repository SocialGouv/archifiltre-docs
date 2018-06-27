import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

const computeCumulative = (array) => {
  const ans = [0]
  for (let i = 0; i < array.length - 1; i++) {
    ans.push(array[i] + ans[i])
  }
  return ans
}

class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    this.computeWidthRec = this.computeWidthRec.bind(this)
  }

  computeWidthRec(ids, x, dx) {
    if (ids.length < 2) {
      dx = Math.max(dx,1)
      return [x, dx]
    } else {
      const props = this.props

      const fWidth = props.fWidth
      const normalizeWidth = props.normalizeWidth
      const getChildrenIdFromId = props.getChildrenIdFromId

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

  render() {
    const props = this.props

    const x = props.x
    const y = props.y
    const dx = props.dx
    const dy = props.dy
    const display_root = props.display_root

    if (display_root.length) {
      const ids = display_root
      const [minimap_x, minimap_width] = this.computeWidthRec(ids,x,dx)

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

export default Presentational
