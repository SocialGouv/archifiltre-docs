import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import * as Color from 'color'


const least_rgba = Color.toRgba(Color.leastRecentDate())
const most_rgba = Color.toRgba(Color.mostRecentDate())

class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      svg_width:100,
      svg_height:5,
    }

  }

  render() {
    const svg_width = this.state.svg_width
    const svg_height = this.state.svg_height

    const cursor_width = svg_width * 0.0075

    const root_node = this.props.getByID(this.props.root_id)
    const last_modified = root_node.get('content').get('last_modified')
    const max_time = last_modified.get('max')
    const min_time = last_modified.get('min')
    const zeroToOne = (prop_name,id) => {
      const node = this.props.getByID(id)
      const last_modified = node.get('content').get('last_modified')
      const time = last_modified.get(prop_name)
      return (time - min_time) / (max_time - min_time)
    }

    

    let cursor_array = []
    if (this.props.id) {

      // const node = this.props.getByID(this.props.id)
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
              x={zeroToOne(prop_name,this.props.id)*svg_width - cursor_width/2}
              y={0}
              width={cursor_width}
              height={svg_height}
              fill='black'
            />
          </g>
        )
      })

      cursor_array.push(
        <g key={'average'}>
          <circle
            cx={zeroToOne('average',this.props.id)*svg_width}
            cy={svg_height/2}
            r={cursor_width}
            fill='red'
          />
        </g>
      )
    }

    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={'0 0 '+svg_width+' '+svg_height}
        width='100%'
        height='100%'
        preserveAspectRatio='none'
        ref={this.ref}
      >
        <g>
          <defs>
            <linearGradient id='time-gradient-grad1' x1='0%' y1='0%' x2='100%' y2='0%'>
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
