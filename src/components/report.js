import React from 'react'
import { connect } from 'react-redux'

import { RIEInput, RIETextArea, RIETags } from 'riek'
// import _ from 'lodash'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'
import { editEntry } from 'reducers/database'

import { typeOf } from 'components/icicle'
import { makeSizeString } from 'components/ruler'

import { mkDummyParent, mkDummyFile } from 'table-tree'

import { edit_hover_container, edit_hover_pencil, tags, comments } from 'css/app.css'

import { tr } from 'dict'

const Presentational = props => {
  let icon, name, real_name, tags_cell, comments_cell

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
        change={(n) => {props.editEntry(props.node_id, 'display_name', n['new_display_name'].length ? n['new_display_name'] : node.get('display_name'))}}
        propName='new_display_name' />
        &ensp;<i className={"fi-pencil " + edit_hover_pencil} style={{'opacity': '0.3'}} />
      </span>);

    real_name = (<span style={{'fontStyle':'italic', 'visibility': (node.get('name') !== node.get('display_name') ? '' : 'hidden')}}>
      ({node.get('name')})</span>);

    tags_cell = (
      <div className={"cell small-4 " + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr("Tags")}</span>
        <span>&ensp;<i className={"fi-pencil " + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
        <span style={{'fontStyle': (node.get('tags').size ? '' : '')}}>
          <RIETags
          value={node.get('tags').size ? node.get('tags') : new Set(["Your", "Tags", "Here"])}
          change={(n) => props.editEntry(props.node_id, 'tags', n['new_tags'])}
          className={tags}
          placeholder={tr("New tag")}
          propName='new_tags'/>
        </span>
      </div>);

    comments_cell = (
      <div className={"cell small-4 " + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em', 'maxHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr("Comments")}</span>
        <span>&ensp;<i className={"fi-pencil " + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
        <span style={{'fontStyle': (node.get('comments').length ? '' : 'italic')}}>
          <RIETextArea
          value={node.get('comments').length ? node.get('comments') : tr("Your text here")+"..."}
          change={(n) => {props.editEntry(props.node_id, 'comments', n['new_comments'].length ? n['new_comments'] : node.get('comments'))}}
          className={comments}
          propName='new_comments'/>
        </span>
      </div>);
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

    real_name = (<span style={{'fontStyle':'italic'}}>({tr("Real name")})</span>);

    tags_cell = (
      <div className={"cell small-4 " + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em', 'maxHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr("Tags")}</span><br />
        <span style={{'fontStyle':'italic'}}>{tr("Your tags here") + "..."}</span>
      </div>);

    comments_cell = (
      <div className={"cell small-4 " + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em', 'maxHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr("Comments")}</span><br />
        <span style={{'fontStyle':'italic'}}>{tr("Your text here") + "..."}</span>
      </div>);
  }

  return (
    <div style={{"opacity": (props.isFocused ? 1 : 0.5), 'background': 'white', 'borderRadius': '1em'}}>

      <div className="grid-x grid-frame">
        <div className="cell small-12">
          <div style={{'display': 'table', 'width':'100%'}}>
            {icon}
            <span style={{'display': 'table-cell', 'verticalAlign':'middle', 'lineHeight':'1.25em'}}>
              {name}<br />{real_name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid-x grid-frame">
          {tags_cell}
          {comments_cell}
      </div>

    </div>
      );
}

const mapStateToProps = state => {
	let icicle_state = selectIcicleState(state)
  let database = selectDatabase(state)

  let sequence = icicle_state.isLocked() ? icicle_state.lock_sequence() : icicle_state.hover_sequence()

  let node_id = sequence[sequence.length - 1]
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
