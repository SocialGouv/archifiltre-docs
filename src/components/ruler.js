import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'

import { typeOf, icicle_dims } from 'components/icicle'

import { mkDummyParent } from 'table-tree'

import { tr } from 'dict'

const Presentational = props => {
  let res

  if(props.isFocused) {
    let text = makeSizeString(props.node.get('content').get('size'), props.total_size)
    let mode = computeRulerTextDisplayMode(props.dims.x + props.dims.dx/2, text.length, icicle_dims.w, 4.2)

    res = (<g><rect
      className="ruler"
      x={props.dims.x}
      y="1.5em"
      width={props.dims.dx}
      height="0.3em"
      onClick={(e) => {e.stopPropagation()}}
      onMouseOver={() => {}}
      style={{"fill":  props.is_parent ? typeOf(mkDummyParent()).color : typeOf(props.node).color}}>
    </rect>
    <text
    x={computeTextPosition(props.dims.x, props.dims.dx, icicle_dims.w, mode)}
    y="3em"
    textAnchor={{"ORGANIC" : "middle", "LEFT" : "start", "RIGHT" : "end"}[mode]}
    >{text}
    </text></g>)
  }
  else res = (<g />);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
      {res}
    </svg>
      );
}

export const octet2HumanReadableFormat = o => {
  let unit = tr('B')
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
  let percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  return percentageString + " | " + sizeString
}


const computeRulerTextDisplayMode = (candidate_position, l, w, fw) => {
  if(candidate_position < l*fw){
      return "LEFT"
    }
    else if(candidate_position > w - (l*fw)){
      return "RIGHT"
    }
    else{
      return "ORGANIC"
    }
}

const computeTextPosition = (x, dx, w, mode) => {
  return {"ORGANIC" : x + dx/2, "LEFT" : 5, "RIGHT" : w - 5}[mode]
}




const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
  let database = selectDatabase(state)

  let node_id = icicle_state.isLocked() ?
    icicle_state.lock_sequence()[icicle_state.lock_sequence().length - 1]
    : icicle_state.hover_sequence()[icicle_state.hover_sequence().length - 1];

  let node = (icicle_state.isFocused() ? database.getByID(node_id) : {})
  let total_size = database.volume()

  let is_parent = icicle_state.isZoomed() && icicle_state.display_root().includes(node_id) && node.get('children').size

	return {
		dims: icicle_state.hover_dims(),
    isFocused: icicle_state.isFocused(),
    node,
    node_id,
    total_size,
    is_parent
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
