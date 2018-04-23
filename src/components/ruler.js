import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/root-reducer'

import { tr } from 'dict'

const Presentational = props => {
	let node = {x:0, dx: 10}

	let display = props.hover_sequence.includes(-1) ? "none" : ""

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
          <g >
            <rect
              className="ruler"
              x={node.x}
              y="1.5em"
              width={node.dx}
              height="0.3em"
              onClick={(e) => {e.stopPropagation()}}
              onMouseOver={() => {}}
              style={{"fill": "black", "display" : display}}>
            </rect>
            <text>
            </text>
          </g>
        </svg>
    
      );
}


const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
	return {
		hover_sequence: icicle_state.hover_sequence()
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
