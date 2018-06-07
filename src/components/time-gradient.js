import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import * as Color from 'color'

const least_rgba = Color.toRgba(Color.leastRecentDate())
const most_rgba = Color.toRgba(Color.mostRecentDate())

const Presentational = props => {
  const cursor_height = 0.75

  const root_node = props.getByID(props.root_id)
  const last_modified = root_node.get('content').get('last_modified')
  const max_time = last_modified.get('max')
  const min_time = last_modified.get('min')
  const zeroToOne = (prop_name,id) => {
    const node = props.getByID(id)
    const last_modified = node.get('content').get('last_modified')
    const time = last_modified.get(prop_name)
    return (time - min_time) / (max_time - min_time)
  }

  const svg_width = 5
  const svg_height = 25

  let cursor_array = []
  if (props.id) {

    // const node = props.getByID(props.id)
    // const last_modified = node.get('content').get('last_modified')
    // const list = last_modified.get('list')
    // cursor_array = list.map((time,i)=>{
    //   const zero_to_one = (time - min_time) / (max_time - min_time)
    //   return (
    //     <g key={'cursor_'+i}>
    //       <rect
    //         x={zero_to_one*svg_width - cursor_width/2}
    //         y={0}
    //         width={cursor_width}
    //         height={svg_height}
    //         fill={'rgba(0, 0, 0, '+ Math.max(1/list.size, 0.01) +')'}
    //         style={style}
    //       />
    //     </g>
    //   )
    // })


    cursor_array = ['min','median','max']
    cursor_array = cursor_array.map(prop_name=>{
      return (
        <g key={prop_name}>
          <rect
            x={0}
            y={zeroToOne(prop_name,props.id)*svg_height - cursor_height/2}
            width={svg_width}
            height={cursor_height}
            fill='black'
          />
        </g>
      )
    })

    cursor_array.push(
      <g key={'average'}>
        <circle
          cx={svg_width/2}
          cy={zeroToOne('average',props.id)*svg_height}
          r={cursor_height}
          fill='red'
        />
      </g>
    )
  }

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox={'0 0 '+svg_width+' '+svg_height}>
      <g>
        <defs>
          <linearGradient id='time-gradient-grad1' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' style={{stopColor:least_rgba}} />
            <stop offset='100%' style={{stopColor:most_rgba}} />
          </linearGradient>
        </defs>
        <rect
          x={0}
          y={0}
          width={svg_width}
          height={svg_height}
          fill='url(#time-gradient-grad1)'
        />
        {cursor_array}
      </g>
    </svg>
  )
}


const mapStateToProps = state => {
  const icicle_state = selectIcicleState(state)
  const database = selectDatabase(state)

  const sequence = icicle_state.isLocked() ? icicle_state.lock_sequence() : icicle_state.hover_sequence()

  const id = sequence.slice(-1)[0]

  return {
    getByID: database.getByID,
    root_id: database.rootId(),
    id,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
