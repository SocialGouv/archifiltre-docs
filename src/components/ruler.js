import React from 'react'

import * as Color from 'color'
import * as ObjectUtil from 'util/object-util'


import pick from 'languages'

const byte_char = pick({
  en: "B",
  fr: "o",
})


const Ruler = props => {
  const ruler_x = props.x
  const ruler_y = props.y
  const ruler_dx = props.dx
  const ruler_dy = props.dy

  props.dims.x = Math.max(props.dims.x, ruler_x)
  props.dims.dx = Math.min(props.dims.dx, ruler_dx)

  let res

  if (props.isFocused) {
    let text = makeSizeString(props.node_size, props.total_size)
    let mode = computeRulerTextDisplayMode(props.dims.x + props.dims.dx/2, text.length, ruler_dx, 4.2)

    res = (
      <g>
        <rect
          className='ruler'
          x={props.dims.x}
          y={ruler_y+ruler_dy*1/3}
          width={props.dims.dx}
          height='0.3em'
          onClick={(e) => {e.stopPropagation()}}
          onMouseOver={() => {}}
          style={{'fill': props.fillColor(props.node_id)}}
        />
        <text
          x={computeTextPosition(props.dims.x, props.dims.dx, ruler_dx, mode)}
          y={ruler_y+ruler_dy*2/3}
          textAnchor={{'ORGANIC' : 'middle', 'LEFT' : 'start', 'RIGHT' : 'end'}[mode]}
        >
          {text}
        </text>
      </g>
    )
  } else {
    res = (<g />)
  }

  return (
    <g>
      {res}
    </g>
  )
}

export const octet2HumanReadableFormat = o => {
  let unit = byte_char
  let To = o/Math.pow(1000,4)
  if (To > 1) {
    return Math.round(To * 10)/10 + ' T' + unit
  }
  let Go = o/Math.pow(1000,3)
  if (Go > 1) {
    return Math.round(Go * 10)/10 + ' G' + unit
  }
  let Mo = o/Math.pow(1000,2)
  if (Mo > 1) {
    return Math.round(Mo * 10)/10 + ' M' + unit
  }
  let ko = o/1000
  if (ko > 1) {
    return Math.round(ko * 10)/10 + ' k' + unit
  }
  return o + ' ' + unit
}

const precisionRound = (number, precision) => {
  let factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

export const makeSizeString = (o, total) => {
  let sizeString = octet2HumanReadableFormat(o)

  let percentage = precisionRound((100 * o / total),1);
  let percentageString = percentage + '%';
  if (percentage < 0.1) {
    percentageString = '< 0.1%';
  }

  return percentageString + ' | ' + sizeString
}


const computeRulerTextDisplayMode = (candidate_position, l, w, fw) => {
  if(candidate_position < l*fw) {
    return 'LEFT'
  } else if (candidate_position > w - (l*fw)) {
    return 'RIGHT'
  } else {
    return 'ORGANIC'
  }
}

const computeTextPosition = (x, dx, w, mode) => {
  return {'ORGANIC' : x + dx/2, 'LEFT' : 5, 'RIGHT' : w - 5}[mode]
}



export default function RulerApiToProps(props) {
  const api = props.api
  const icicle_state = api.icicle_state
  const database = api.database

  const node_id = icicle_state.sequence().slice(-1)[0]

  const total_size = database.volume()

  const getFfByFfId = database.getFfByFfId
  const node = getFfByFfId(node_id)
  let node_size
  if (node) {
    node_size = node.get('size')
  }

  props = ObjectUtil.compose({
    dims: icicle_state.hover_dims(),
    isFocused: icicle_state.isFocused(),
    node_size,
    node_id,
    total_size,
  },props)

  return (<Ruler {...props}/>)
}
