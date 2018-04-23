import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState } from 'reducers/root-reducer'

import { tr } from 'dict'

const Presentational = props => {
	if(props.hover_sequence.includes(-1)){
    let res = []

    for(let i = 0; i < props.hover_sequence.length; i++){
      res.push(
        <polygon>
        </polygon>
        <text>
        </text>)
    }

    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        <g>
          <polygon></polygon>
          <text>
          </text>
        </g>
      </svg>
      );
  }
  else{
    let res = []

    for(let i = 0; i < props.hover_sequence.length; i++){
      res.push(
        <polygon>
        </polygon>
        <text>
        </text>)
    }
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        <g>
          {res}
        </g>
      </svg>
        );
  }

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
