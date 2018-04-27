import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'

import { typeOf, icicle_dims } from 'components/icicle'

import BreadCrumbText from 'components/breadcrumb-text'
import BreadCrumbPoly from 'components/breadcrumb-poly'

import { mkDummyParent, mkDummyFile } from 'table-tree'

import { tr } from 'dict'

const breadcrumb_dims = {w: 400, h: 300}

const Presentational = props => {
  let res = []

  if(props.isFocused){
    for(let i = 1; i < props.hover_sequence.length; i++){
      let node = props.getByID(props.hover_sequence[i])
      let node_id = props.hover_sequence[i]
      let is_parent = props.isZoomed && props.display_root.includes(node_id) && node.get('children').size

      res.push(
        <g key={"breadcrumb" + i}>
          <BreadCrumbPoly
          is_last={i === props.hover_sequence.length-1}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          type={is_parent ? typeOf(mkDummyParent()) : typeOf(node)}
          w={breadcrumb_dims.w}
          is_dummy={false}/>
          <BreadCrumbText
          key={"text" + i}
          text={node.get('name')}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          w={breadcrumb_dims.w}
          is_dummy={false}/>
        </g>);
    }
  }

  else{
    let i = 1

    if(props.max_depth > 1){
      res.push(
        <g key={"breadcrumb" + i}>
          <BreadCrumbPoly
          is_last={false}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          type={typeOf(mkDummyFile())}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
          <BreadCrumbText
          key={"text" + i}
          text={tr("Level") + " " + (i)}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
        </g>);
      i++
    }

    if(props.max_depth > 2){
      res.push(
        <g key={"breadcrumb" + i}>
          <BreadCrumbPoly
          is_last={false}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          type={typeOf(mkDummyFile())}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
          <BreadCrumbText
          key={"text" + i}
          text={tr("Level") + " " + (i)}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
        </g>);
      i++
    }

    if(props.max_depth > 3){
      res.push(
        <g key={"breadcrumb" + i}>
          <BreadCrumbPoly
          is_last={false}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          type={typeOf(mkDummyFile())}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
          <BreadCrumbText
          key={"text" + i}
          text="..."
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
        </g>);
      i++
    }

    if(props.max_depth > 4){
      res.push(
        <g key={"breadcrumb" + i}>
          <BreadCrumbPoly
          is_last={false}
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          type={typeOf(mkDummyFile())}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
          <BreadCrumbText
          key={"text" + i}
          text="..."
          level={i}
          step={icicle_dims.h/(props.max_depth+1)}
          w={breadcrumb_dims.w}
          is_dummy={true}/>
        </g>);
      i++
    }

    res.push(
      <g key={"breadcrumb" + i}>
        <BreadCrumbPoly
        is_last={true}
        level={i}
        step={icicle_dims.h/(props.max_depth+1)}
        type={typeOf(mkDummyFile())}
        w={breadcrumb_dims.w}
        is_dummy={true}/>
        <BreadCrumbText
        key={"text" + i}
        text={tr("File")}
        level={i}
        step={icicle_dims.h/(props.max_depth+1)}
        w={breadcrumb_dims.w}
        is_dummy={true}/>
      </g>);
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" style={{"opacity": (props.isFocused ? 1 : 0.3)}}>
      {res}
    </svg>
      );

}

export const smartClip = (s, w, fw) => {
    var target_size = Math.floor(w/fw)
    var slice = Math.floor(target_size/2)

    if(s.length > target_size){
      return s.substring(0, slice-2) + "..." + s.substring(s.length - slice + 2, s.length)
    }
    else{
      return s
    }
  }


const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
  let database = selectDatabase(state)
	return {
		hover_sequence: icicle_state.hover_sequence(),
    display_root: icicle_state.display_root(),
    isFocused: icicle_state.isFocused(),
    isZoomed: icicle_state.isZoomed(),
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
