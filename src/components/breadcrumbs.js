import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'

import { typeOf, icicle_dims } from 'components/icicle'

import BreadCrumbText from 'components/breadcrumb-text'
import BreadCrumbPoly from 'components/breadcrumb-poly'

import { tr } from 'dict'

const breadcrumb_dims = {w: 400, h: 300}

const Presentational = props => {
  let res = []

  if(props.isFocused){
    for(let i = 1; i < props.hover_sequence.length; i++){
      let node = props.getByID(props.hover_sequence[i])

      res.push(
        <g key={"breadcrumb" + i}>
          <BreadCrumbPoly
          // is_last={i === props.hover_sequence.length-1}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          type={typeOf(node)}
          w={breadcrumb_dims.w}
          isDummy={false}/>
          <BreadCrumbText
          key={"text" + i}
          text={node.name}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          w={breadcrumb_dims.w}
          isDummy={false}/>
        </g>);
    }
  }
  else{
    for(let i = 1; i < props.max_depth+1; i++){
      res.push(
        <g key={"breadcrumb" + i}>
          <BreadCrumbPoly
          // is_last={i === props.max_depth}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          type={typeOf({children:[], name:''})}
          w={breadcrumb_dims.w}
          isDummy={true}/>
          <BreadCrumbText
          key={"text" + i}
          text={(i === props.max_depth ? tr("File") : tr("Level") + " " + (i))}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          w={breadcrumb_dims.w}
          isDummy={true}/>
        </g>);
    }
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" style={{"opacity": (props.isFocused ? 1 : 0.3)}}>
      {res}
    </svg>
      );

}


const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
  let database = selectDatabase(state)
	return {
		hover_sequence: icicle_state.hover_sequence(),
    isFocused: icicle_state.isFocused(),
    max_depth: database.max_depth(),
    getByID : database.getByID
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
