import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'

import { typeOf } from 'components/icicle'
import { makeSizeString } from 'components/ruler'

import { tr } from 'dict'

const Presentational = props => {
  let icon, name, size

  if(props.isFocused) {
    let node = props.node
    let type = typeOf(node)
    let isFolder = type.label === tr("Folder") || type.label === tr("Root")

    icon = <i className={(isFolder ? "fi-folder" : "fi-page")} style={{
      'fontSize': '2em',
      'width': '1.2em',
      'color': type.color,
      'display': 'table-cell',
      'verticalAlign':'middle'}}/>
    name = <span style={{'fontWeight':'bold', 'display': 'table-cell', 'verticalAlign':'middle', 'horizontalmarginLeft':'1em'}}>{node.name}</span>
    size = <span>{makeSizeString(node.content.size, props.total_size)}</span>
  }
  else{
    icon = <i className="fi-archive" style={{
      'fontSize': '2em',
      'width': '1.2em',
      'color': typeOf({children:[], name:''}).color,
      'display': 'table-cell',
      'verticalAlign':'middle'}}/>
    name = <span style={{'fontWeight':'bold', 'display': 'table-cell', 'verticalAlign':'middle', 'horizontalmarginLeft':'1em'}}>{tr("Folder of file's name")}</span>
    size = <span>{tr("Size") + " : " + tr("absolute") + " | " + tr("percentage of the whole")}</span>
  }

  return (
    <div style={{"opacity": (props.isFocused ? 1 : 0.3), 'display': 'table', 'width':'100%'}}>
      {icon}{name}
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
