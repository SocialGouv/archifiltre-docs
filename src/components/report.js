import React from 'react'
import { connect } from 'react-redux'

import { RIEInput, RIETextArea, RIETags } from 'riek'

import TagsCell from 'components/report-cell-tags'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'
import { setContentByID, addTagged, deleteTagged } from 'reducers/database'

import { makeSizeString, octet2HumanReadableFormat } from 'components/ruler'

import { edit_hover_container, edit_hover_pencil, editable_text, element_name, bold, tags, comments } from 'css/app.css'

import LastModifiedReporter from 'components/last-modified-reporter'


import * as Content from 'content'
import { commit } from 'reducers/root-reducer'
import * as Color from 'color'

import { tr } from 'dict'


const pad = '1em'

const cells_style = {
  'borderRadius' : '1em',
  'padding':'0.6em 1em 0 1em',
  'fontSize': '0.8em',
}


const info_cell_style = {
  'fontSize': '0.8em',
}

const margin_padding_compensate = {
  padding: '0.2em 0.8em',
}



const Icon = props => {
  const placeholder = props.placeholder
  const is_folder = props.is_folder
  const fillColor = props.fillColor
  const node_id = props.node_id

  let class_name
  let color
  if (placeholder) {
    class_name = 'fi-page-multiple'
    color = Color.placeholder()
  } else {
    color = fillColor(node_id)
    if (is_folder) {
      class_name = 'fi-folder'
    } else {
      class_name = 'fi-page'
    }
  }

  return (
    <div style={{marginTop: '-1em', marginBottom: '-1em'}}>
      <i className={class_name} style={{fontSize: '3em', color}}/>
    </div>
  )
}

const Name = props => {
  const placeholder = props.placeholder
  const onChangeAlias = props.onChangeAlias
  const node_id = props.node_id
  const display_name = props.display_name
  const bracket_name = props.bracket_name
  const n_content = props.n_content
  const n_name = props.n_name

  if (placeholder) {
    return (
      <div style={{'fontWeight':'bold'}}>{tr('Folder of file\'s name')}</div>
    )
  } else {
    return (
      <span className={edit_hover_container} style={margin_padding_compensate}>
        <RIEInput
          value={display_name.length > 0 ? display_name : bracket_name}
          change={onChangeAlias('new_display_name', node_id, n_content, n_name)}
          className={editable_text + ' ' + element_name + ' ' + bold}
          propName='new_display_name'
        />
        &ensp;
        <i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} />
      </span>
    )
  }
}

const RealName = props => {
  const placeholder = props.placeholder
  const bracket_name = props.bracket_name

  if (placeholder) {
    return (
      <div style={{'fontStyle':'italic'}}>({tr('Real name')})</div>
    )
  } else {
    return (
      <div style={{'fontStyle':'italic', 'visibility': (bracket_name === '' ? 'hidden' : '')}}>
        ({bracket_name})
      </div>
    )
  }
}

const InfoCell = props => {
  const placeholder = props.placeholder
  const c_size = props.c_size
  const node_id = props.node_id

  let size_label
  let component
  if (placeholder) {
    size_label = '...'
    component = <LastModifiedReporter placeholder={true}/>
  } else {
    size_label = c_size
    component = <LastModifiedReporter id={node_id} placeholder={false}/>
  }

  return (
    <div style={info_cell_style}>
      <b>{tr('Size')} :</b> {size_label}<br />
      {component}
    </div>
  )
}

const CommentCell =  props => {
  const placeholder = props.placeholder
  const node_id = props.node_id
  const onChangeComments = props.onChangeComments
  const c_comments = props.c_comments
  const n_content = props.n_content

  if (placeholder) {
    return (
      <div style={cells_style}>
        <b>{tr('Comments')}</b><br />
        <span style={{'fontStyle':'italic'}}>{tr('Your text here') + '...'}</span>
      </div>
    )
  } else {
    return (
      <div className={edit_hover_container} style={cells_style}>
        <b>{tr('Comments')}</b>
        <span>&ensp;<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
        <span style={{'fontStyle': (c_comments.length ? '' : 'italic')}}>
          <RIETextArea
            value={c_comments.length ? c_comments : tr('Your text here')+'...'} // ##############' Placeholder ???'
            change={onChangeComments('new_comments', node_id, n_content)}
            className={comments}
            propName='new_comments'
            validate={(s) => s.replace(/\s/g,'').length > 0}
          />
        </span>
      </div>
    )
  }
}


const Presentational = props => {
  let icon, name, real_name, info_cell, tags_cell, comments_cell, name_cell

  if(props.isFocused) {
    const node = props.node
    const n_children = node.get('children')
    const n_name = node.get('name')
    const n_content = node.get('content')

    const c_size = octet2HumanReadableFormat(n_content.get('size'))

    const c_alias = n_content.get('alias')
    const c_tags = n_content.get('tags')
    const c_comments = n_content.get('comments')

    const display_name = c_alias === '' ? n_name : c_alias
    const bracket_name = c_alias === '' ? '' : n_name

    const is_folder = n_children.size > 0

    icon = <Icon
      is_folder={is_folder}
      fillColor={props.fillColor}
      node_id={props.node_id}
    />

    name = <Name
      onChangeAlias={props.onChangeAlias}
      node_id={props.node_id}
      display_name={display_name}
      bracket_name={bracket_name}
      n_content={n_content}
      n_name={n_name}
    />

    real_name = <RealName
      bracket_name={bracket_name}
    />

    info_cell = <InfoCell
      placeholder={true}
      c_size={c_size}
      node_id={props.node_id}
    />

    tags_cell = <TagsCell
      isDummy={false}
      cells_style={cells_style}
      tags={c_tags}
      node_id={props.node_id}
      content={n_content}
    />

    comments_cell = <CommentCell
      node_id={props.node_id}
      onChangeComments={props.onChangeComments}
      c_comments={c_comments}
      n_content={n_content}
    />
  } else {
    icon = <Icon placeholder={true}/>
    name = <Name placeholder={true}/>
    real_name = <RealName placeholder={true}/>
    info_cell = <InfoCell placeholder={true}/>
    tags_cell = <TagsCell isDummy={true} cells_style={cells_style} />
    comments_cell = <CommentCell placeholder={true}/>
  }


  name_cell = (
    <div className='grid-x align-middle'>
      <div className='cell shrink' style={{paddingRight:pad}}>
        {icon}
      </div>
      <div className='cell auto'>
        <div className='grid-x'>
          <div className='cell small-12'>
            {name}
          </div>
          <div className='cell small-12'>
            {real_name}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={
      {
        opacity: (props.isFocused ? 1 : 0.5),
        background: 'white',
        borderRadius: '1em',
        minHeight: '11em',
        maxHeight: '11em',
      }
    }>
      <div className='grid-x' style={{padding:pad}}>
        <div className='cell small-8' style={{paddingRight:pad}}>
          <div className='grid-x'>
            <div className='cell small-12' style={{paddingBottom:pad}}>
              {name_cell}
            </div>
            <div className='cell small-6' style={{paddingRight:pad}}>
              {tags_cell}
            </div>
            <div className='cell small-6'>
              {comments_cell}
            </div>
          </div>
        </div>
        <div className='cell small-4'>
          {info_cell}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  let icicle_state = selectIcicleState(state)
  let database = selectDatabase(state)

  let sequence = icicle_state.isLocked() ? icicle_state.lock_sequence() : icicle_state.hover_sequence()

  const getByID = database.getByID

  let node_id = sequence[sequence.length - 1]
  let node = (icicle_state.isFocused() ? getByID(node_id) : {})
  let total_size = database.volume()

	return {
    isFocused: icicle_state.isFocused(),
    isLocked: icicle_state.isLocked(),
    node,
    node_id,
    total_size
	}
}

const mapDispatchToProps = dispatch => {
  const onChangeAlias = (prop_name, id, content, old_name) => (n) => {
    let new_alias = n[prop_name] === old_name ? '' : n[prop_name]
    new_alias = new_alias.replace(/^\s*|\s*$/g,'')

    content = content.set('alias', new_alias)
    dispatch(setContentByID(id, content))
    dispatch(commit())
  }

  const onChangeComments = (prop_name, id, content) => (n) => {
    content = content.set('comments', n[prop_name])
    dispatch(setContentByID(id, content))
    dispatch(commit())
  }
 	return {
    onChangeAlias,
    onChangeComments,
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
