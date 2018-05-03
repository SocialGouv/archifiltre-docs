import React from 'react'
import { connect } from 'react-redux'

import { RIEInput } from 'riek'
// import _ from 'lodash'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'
import { editEntry } from 'reducers/database'

import { typeOf } from 'components/icicle'
import { makeSizeString } from 'components/ruler'

import { mkDummyParent, mkDummyFile } from 'table-tree'

import { edit_hover_container, edit_hover_pencil } from 'css/app.css'

import { tr } from 'dict'

const Presentational = props => {
  let icon, name, real_name

  if(props.isFocused) {
    let node = props.node
    let type = typeOf(node)
    let is_folder = type.label === tr("Folder") || type.label === tr("Root")

    let is_parent = props.isZoomed && props.display_root.includes(props.node_id) && props.node.get('children').size

    icon = (<i className={(is_folder ? "fi-folder" : "fi-page")} style={{
      'fontSize': '3em',
      'width': '1.7em',
      'color': is_parent ? typeOf(mkDummyParent()).color : typeOf(node).color,
      'display': 'table-cell',
      'paddingLeft': '0.5em',
      'verticalAlign':'middle'}}/>);
    name = (<span style={{'fontWeight':'bold'}} className={edit_hover_container}>
        <RIEInput
        value={node.get('display_name')}
        change={(n) => {props.editEntry(props.node_id, 'display_name', n['new_display_name'])}}
        propName='new_display_name' />
        &ensp;<i className={"fi-pencil " + edit_hover_pencil} style={{'opacity': '0.3'}} />
      </span>);
    real_name = (<span style={{'fontStyle':'italic', 'visibility': (node.get('name') !== node.get('display_name') ? '' : 'hidden')}}>
      ({node.get('name')})</span>);
  }

  else{
    icon = (<i className="fi-page-multiple" style={{
      'fontSize': '3em',
      'width': '1.7em',
      'color': typeOf(mkDummyFile()).color,
      'display': 'table-cell',
      'paddingLeft': '0.5em',
      'verticalAlign':'middle'}}/>);
    name = (<span style={{'fontWeight':'bold'}}>{tr("Folder of file's name")}</span>);
    real_name = (<span style={{'fontStyle':'italic'}}>{tr("Folder of file's real name")}</span>);
  }

  return (
    <div style={{"opacity": (props.isFocused ? 1 : 0.3), 'display': 'table', 'width':'100%'}}>
      {icon}
      <span style={{'display': 'table-cell', 'verticalAlign':'middle', 'lineHeight':'1.25em'}}>
        {name}<br />{real_name}
      </span>
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
 	return {
    editEntry: (...args) => dispatch((editEntry(...args))),
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
