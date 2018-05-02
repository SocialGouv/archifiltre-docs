import React from 'react'
import { connect } from 'react-redux'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'

import { typeOf } from 'components/icicle'
import { makeSizeString } from 'components/ruler'

import { mkDummyParent, mkDummyFile } from 'table-tree'

import { tr } from 'dict'

const Presentational = props => {
  let icon, name, size

  if(props.isFocused) {
    let node = props.node
    let type = typeOf(node)
    let is_folder = type.label === tr("Folder") || type.label === tr("Root")

    let is_parent = props.isZoomed && props.display_root.includes(props.node_id) && props.node.get('children').size

    icon = <i className={(is_folder ? "fi-folder" : "fi-page")} style={{
      'fontSize': '2em',
      'width': '1.2em',
      'color': is_parent ? typeOf(mkDummyParent()).color : typeOf(node).color,
      'display': 'table-cell',
      'verticalAlign':'middle'}}/>
    name = <span style={{'fontWeight':'bold', 'display': 'table-cell', 'verticalAlign':'middle', 'horizontalmarginLeft':'1em'}}>{node.get('name')}</span>
    size = <span>{makeSizeString(node.get('content').get('size'), props.total_size)}</span>
  }
  else{
    icon = <i className="fi-page-multiple" style={{
      'fontSize': '2em',
      'width': '1.2em',
      'color': typeOf(mkDummyFile()).color,
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

  let node_id = icicle_state.hover_sequence()[icicle_state.hover_sequence().length - 1]
  let node = (icicle_state.isFocused() ? database.getByID(node_id) : {})
  let total_size = database.volume()

	return {
    display_root: icicle_state.display_root(),
    isFocused: icicle_state.isFocused(),
    isZoomed: icicle_state.isZoomed(),
    node,
    node_id,
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
