import React from 'react'
import { connect } from 'react-redux'

import { RIEInput, RIETextArea, RIETags } from 'riek'

import { selectIcicleState, selectDatabase } from 'reducers/root-reducer'
import { setContentByID } from 'reducers/database'

import { makeSizeString } from 'components/ruler'

import { edit_hover_container, edit_hover_pencil, tags, comments } from 'css/app.css'

import * as Content from 'content'
import { commit } from 'reducers/root-reducer'
import * as Color from 'color'

import { tr } from 'dict'

const Presentational = props => {
  let icon, name, real_name, tags_cell, comments_cell

  if(props.isFocused) {
    const node = props.node
    const n_children = node.get('children')
    const n_name = node.get('name')
    const n_content = node.get('content')
    const c_alias = n_content.get('alias')
    const c_tags = new Set(Content.tagsToJs(n_content.get('tags')))
    const c_comments = n_content.get('comments')

    const display_name = c_alias === '' ? n_name : c_alias
    const bracket_name = c_alias === '' ? '' : n_name


    const is_folder = n_children.size > 0

    icon = (
      <i className={(is_folder ? 'fi-folder' : 'fi-page')} style={{
        'fontSize': '3em',
        'width': '1.7em',
        'color': props.fillColor(props.node_id),
        'display': 'table-cell',
        'paddingLeft': '0.5em',
        'verticalAlign':'middle'}}
      />
    )

    name = (
      <span style={{'fontWeight':'bold'}} className={edit_hover_container}>
        <RIEInput
          value={display_name}
          change={props.onChangeAlias('new_display_name', props.node_id, n_content)}
          propName='new_display_name'
        />
        &ensp;
        <i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} />
      </span>
    )

    real_name = (
      <span style={{'fontStyle':'italic', 'visibility': (bracket_name === '' ? 'hidden' : '')}}>
        ({bracket_name})
      </span>
    )

    tags_cell = (
      <div className={'cell small-4 ' + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr('Tags')}</span>
        <span>&ensp;<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
        <span style={{'fontStyle': (c_tags.size ? '' : '')}}>
          <RIETags
            value={c_tags.size ? c_tags : new Set(['Your', 'Tags', 'Here'])}
            change={props.onChangeTags('new_tags', props.node_id, n_content)}
            className={tags}
            placeholder={tr('New tag')}
            propName='new_tags'
          />
        </span>
      </div>
    )

    comments_cell = (
      <div className={'cell small-4 ' + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em', 'maxHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr('Comments')}</span>
        <span>&ensp;<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
        <span style={{'fontStyle': (c_comments.length ? '' : 'italic')}}>
          <RIETextArea
            value={c_comments.length ? c_comments : tr('Your text here')+'...'} // ##############' Placeholder ???"
            change={props.onChangeComments('new_comments', props.node_id, n_content)}
            className={comments}
            propName='new_comments'
          />
        </span>
      </div>
    )
  } else {
    icon = (
      <i className='fi-page-multiple' style={{
        'fontSize': '3em',
        'width': '1.7em',
        'color': Color.placeholder(),
        'display': 'table-cell',
        'paddingLeft': '0.5em',
        'verticalAlign':'middle'}}
      />
    )

    name = (<span style={{'fontWeight':'bold'}}>{tr('Folder of file\'s name')}</span>)

    real_name = (<span style={{'fontStyle':'italic'}}>({tr('Real name')})</span>)

    tags_cell = (
      <div className={'cell small-4 ' + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em', 'maxHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr('Tags')}</span><br />
        <span style={{'fontStyle':'italic'}}>{tr('Your tags here') + '...'}</span>
      </div>
    )

    comments_cell = (
      <div className={'cell small-4 ' + edit_hover_container} style={{'padding':'1em', 'fontSize': '0.8em', 'minHeight': '8em', 'maxHeight': '8em'}}>
        <span style={{'fontWeight': 'bold'}}>{tr('Comments')}</span><br />
        <span style={{'fontStyle':'italic'}}>{tr('Your text here') + '...'}</span>
      </div>
    )
  }

  return (
    <div style={{'opacity': (props.isFocused ? 1 : 0.5), 'background': 'white', 'borderRadius': '1em'}}>

      <div className='grid-x grid-frame'>
        <div className='cell small-12'>
          <div style={{'display': 'table', 'width':'100%'}}>
            {icon}
            <span style={{'display': 'table-cell', 'verticalAlign':'middle', 'lineHeight':'1.25em'}}>
              {name}<br />{real_name}
            </span>
          </div>
        </div>
      </div>

      <div className='grid-x grid-frame'>
          {tags_cell}
          {comments_cell}
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
  const onChangeAlias = (prop_name, id, content) => (n) => {
    content = content.set('alias', n[prop_name])
    dispatch(setContentByID(id, content))
    dispatch(commit())
  }

  const onChangeTags = (prop_name, id, content) => (n) => {
    content = content.set('tags', Content.tagsFromJs([...n[prop_name]]))
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
    onChangeTags,
    onChangeComments
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
