import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase } from 'reducers/root-reducer'
import * as Color from 'color'

const least_rgba = 'rgba(0,0,0,0)'
const most_rgba = 'rgba(0,0,0,'+ 10/255 +')'


class MouseCursor extends React.PureComponent {
  render() {
    const x = this.props.x
    const cursor_width = this.props.cursor_width
    const svg_width = this.props.svg_width
    const svg_height = this.props.svg_height

    return (
      <g>
        <rect
          x={x*svg_width - cursor_width/2}
          y={0}
          width={cursor_width}
          height={svg_height}
          fill={'red'}
        />
      </g>
    )
  }
}

class RugTimePlot extends React.PureComponent {
  render() {
    const cursor_width = this.props.cursor_width
    const svg_width = this.props.svg_width
    const svg_height = this.props.svg_height

    const root_id = this.props.root_id
    const getByID = this.props.getByID

    const root_node = getByID(root_id)
    const last_modified = root_node.get('content').get('last_modified')
    const max_time = last_modified.get('max')
    const min_time = last_modified.get('min')

    const zeroToOne = (id) => {
      const node = getByID(id)
      const last_modified = node.get('content').get('last_modified')
      const time = last_modified.get('max')
      return (time - min_time) / (max_time - min_time)
    }

    const leaf_id_array = this.props.leaf_id_array

    const cursor_array = leaf_id_array.map((id)=>{
      const zero_to_one = zeroToOne(id)
      return (
        <g key={'rug-time-plot-cursor'+id}>
          <rect
            x={zero_to_one*svg_width - cursor_width/2}
            y={0}
            width={cursor_width}
            height={svg_height}
            fill={'rgba(0,0,0,'+ 1/255 +')'}
          />
        </g>
      )
    })

    return (
      <g>
        {cursor_array}
      </g>
    )
  }
}

class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      x: -1,
      y: -1,
    }

    this.setCursorPosition = this.setCursorPosition.bind(this)
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this)
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this)
  }


  setCursorPosition(x,y) {
    this.setState({x,y})
  }

  handleOnMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.x)/rect.width
    const y = (e.clientY - rect.y)/rect.height
    this.setCursorPosition(x,y)
  }

  handleOnMouseOut(e) {
    // this.setCursorPosition(-1,-1)
  }

  render() {
    const cursor_width = 0.5
    const svg_width = 100
    const svg_height = 5

    const root_id = this.props.root_id
    const getByID = this.props.getByID
    const leaf_id_array = this.props.leaf_id_array

    return (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox={'0 0 '+svg_width+' '+svg_height}>
        <g onMouseMove={this.handleOnMouseMove} onMouseOut={this.handleOnMouseOut}>
          <defs>
            <linearGradient id='rug-time-plot-grad1' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' style={{stopColor:least_rgba}} />
              <stop offset='50%' style={{stopColor:most_rgba}} />
              <stop offset='100%' style={{stopColor:least_rgba}} />
            </linearGradient>
          </defs>
          <rect
            x={0}
            y={0}
            width={svg_width}
            height={svg_height}
            fill='white'
          />
          <RugTimePlot
            svg_width={svg_width}
            cursor_width={cursor_width}
            svg_height={svg_height}

            root_id={root_id}
            getByID={getByID}
            leaf_id_array={leaf_id_array}
          />
          <MouseCursor 
            x={this.state.x}
            svg_width={svg_width}
            cursor_width={cursor_width}
            svg_height={svg_height}
          />
        </g>
      </svg>
    )
  }
}


const mapStateToProps = state => {
  const database = selectDatabase(state)


  return {
    getByID: database.getByID,
    root_id: database.rootId(),
    leaf_id_array: database.getLeafIdArray(),
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
