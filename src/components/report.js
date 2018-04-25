import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'

import { typeOf } from 'components/icicle'
import { makeSizeString } from 'components/ruler'

import { tr } from 'dict'

const Presentational = props => {
  let icon, name, size

  if(props.isFocused) {
    
  }
  else{
    icon = <img src="" />
    name = <span>{tr("Folder of file's name")}</span>
    size = <span>{tr("Size") + " : " + tr("absolute") + " | " + tr("percentage of the whole")}</span>
  }

  return (
    <div style={{"opacity": (props.isFocused ? 1 : 0.3)}}>
      {icon}<br />
      {name}<br />
      {size}
    </div>
      );
}

const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
  let database = selectDatabase(state)

  let node = (icicle_state.isFocused() ? database.getByID(icicle_state.hover_sequence()[icicle_state.hover_sequence().length - 1]) : {})
  let total_size = database.getByID(database.getRootIDs()[0]).content.size

	return {
    isFocused: icicle_state.isFocused(),
    node,
    total_size
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
