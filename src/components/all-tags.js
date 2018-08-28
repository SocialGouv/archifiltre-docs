import React from 'react'

import * as ObjectUtil from 'util/object-util'
import { tags_bubble, tags_count, tags_add, tags_cross, visibleonhover } from 'css/app.css'

import TagListItem from 'components/all-tags-item'
import TextAlignCenter from 'components/text-align-center'

import * as Color from 'color'

import { tr } from 'dict'

const trimString = (s, max_length) => {
  return s.length > max_length+3 ? s.substring(0,max_length) + "..." : s
}

const content_style = {
  fontSize: '0.8em',
  overflowY: 'auto',
  overflowX: 'hidden',
  maxHeight: '10.5em'
}


const Presentational = props => {
  const tag_ids = props.tag_ids

  const component_style = {
    'opacity': (tag_ids.size > 0 ? 1 : 0.5),
    'background': 'white',
    'height': '100%',
    'borderRadius': '1em',
    padding:'0.5em 0'
  }

  let tags_content

  const getTagByTagId = props.getTagByTagId
  const tag_id_being_edited = props.tag_id_being_edited
  const tag_id_to_highlight = props.tag_id_to_highlight

  const total_volume = props.total_volume
  const focused_node_id = props.focused_node_id

  const computeOpacity = (tag_id) => {
    if (tag_id_being_edited.length > 0) {
      if (tag_id_being_edited === tag_id) {
        return 1
      } else {
        return 0.2
      }
    } else {
      if (tag_id_to_highlight.length > 0) {
        if (tag_id_to_highlight === tag_id) {
          return 1
        } else {
          return 0.2
        }
      } else {
        return 1
      }
    }
  }

  // Dummy display for when there aren't any tags yet
  if (tag_ids.size === 0) {
    tags_content = (
      <div className='grid-y grid-frame align-center' style={{height:'75%'}}>
        <div className='cell'>
          <TextAlignCenter>
            <i className='fi-pricetag-multiple' style={{
              'color': Color.placeholder(),
              'fontSize': '4em',
              'lineHeight': 0}}
            />
          </TextAlignCenter>
        </div>
        <div className='cell'>
          <TextAlignCenter>
            <em>{tr('No tags at the moment.')}</em>
          </TextAlignCenter>
        </div>
      </div>
    )
  } else {
    // Displaying the list of all tags

    const tags_list = tag_ids.map(tag_id => {
      const tag = getTagByTagId(tag_id)
      const name = tag.get('name')
      const ff_ids = tag.get('ff_ids')
      const size = tag.get('size')

      const opacity = computeOpacity(tag_id)
      
      const percentage = Math.floor((size / total_volume)*100)

      const editing = tag_id_being_edited === tag_id
      const shoud_display_count = (focused_node_id === undefined)
      const node_has_tag = ff_ids.has(focused_node_id)

      return (
        <TagListItem
          key={tag_id}
          tag={name}
          opacity={opacity}
          editing={editing}
          percentage={percentage}
          shoud_display_count={shoud_display_count}
          node_has_tag={node_has_tag}
          tag_number={ff_ids.size}
          highlightTag={props.highlightTag(tag_id)}
          stopHighlightingTag={props.stopHighlightingTag}
          startEditingTag={props.startEditingTag(tag_id)}
          stopEditingTag={props.stopEditingTag}
          deleteTag={props.onDeleteTag(tag_id)}
          renameTag={props.onRenameTag(tag_id)}
          addTagToNode={props.onAddTagged(focused_node_id,tag_id)}
          removeTagFromNode={props.onDeleteTagged(focused_node_id,tag_id)}
        />
      )
    }).reduce((acc,val)=>[...acc,val],[])


    tags_content = (
      <div style={content_style} onMouseLeave={props.stopHighlightingTag}>
        {tags_list}
      </div>
    )
  }



  return (
    <div style={component_style}>
      <TextAlignCenter>
        <b>{tr('All tags')}</b>
      </TextAlignCenter>
        {tags_content}
    </div>
  )
}




export default (props) => {
  const api = props.api
  const icicle_state = api.icicle_state
  const tag_list_state = api.tag_list_state
  const database = api.database

  // const tags = database.getAllTags().sortBy(t => -1 * t.size)
  // const tags_sizes = database.getAllTagsSizes()
  const tag_ids = database.getAllTagIds()
  
  const total_volume = database.volume()

  const sequence = icicle_state.sequence()
  const focused_node_id = sequence[sequence.length - 1]

  const tag_id_to_highlight = icicle_state.tagIdToHighlight()

  const tag_id_being_edited = tag_list_state.tagIdBeingEdited()



  const highlightTag = (tag_id) => () => {
    icicle_state.setTagIdToHighlight(tag_id)
  }

  const stopHighlightingTag = () => {
    icicle_state.setNoTagIdToHighlight()
  }

  const startEditingTag = (tag_id) => () => {
    tag_list_state.setTagIdBeingEdited(tag_id)
  }

  const stopEditingTag = () => {
    tag_list_state.setNoTagIdBeingEdited()
  }

  const onRenameTag = (tag_id) => (name) => {
    database.renameTag(name,tag_id)
    api.undo.commit()
  }

  const onDeleteTag = (tag_id) => () => {
    database.deleteTag(tag_id)
    icicle_state.setNoTagIdToHighlight()
    api.undo.commit()
  }

  const onAddTagged = (ff_id,tag_id) => () => {
    if(ff_id !== undefined){
      database.addTagged(ff_id,tag_id)
      api.undo.commit()
    }
  }

  const onDeleteTagged = (ff_id,tag_id) => () => {
    if(ff_id !== undefined){
      database.deleteTagged(ff_id,tag_id)
      api.undo.commit()
    }
  }


  props = ObjectUtil.compose({
    tag_ids,
    tag_id_to_highlight,
    focused_node_id,
    tag_id_being_edited,
    total_volume,
    getTagByTagId:database.getTagByTagId,


    highlightTag,
    stopHighlightingTag,
    startEditingTag,
    stopEditingTag,
    onRenameTag,
    onDeleteTag,
    onAddTagged,
    onDeleteTagged,
  },props)

  return (<Presentational {...props}/>)
}

