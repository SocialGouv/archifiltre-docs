import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState, selectTagListState } from 'reducers/root-reducer'
import { addTagged, deleteTagged, renameTag, deleteTag } from 'reducers/database'
import { setTagToHighlight, setNoTagToHighlight } from 'reducers/icicle-state'
import { setTagBeingEdited, setNoTagBeingEdited } from 'reducers/tag-list-state'

import { tags_bubble, tags_count, tags_add, tags_cross, visibleonhover } from 'css/app.css'

import Tag from 'components/tag'
import TagListItem from 'components/all-tags-item'
import TextAlignCenter from 'components/text-align-center'

import * as Color from 'color'
import { commit } from 'reducers/root-reducer'
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
  const component_style = {
    'opacity': (props.tags.size > 0 ? 1 : 0.5),
    'background': 'white',
    'height': '100%',
    'borderRadius': '1em',
    padding:'0.5em 0.5em'
  }

  let tags_content

  // Dummy display for when there aren't any tags yet
  if(props.tags.size === 0){
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
    );
  }



  // Displaying the list of all tags
  else {

    let tags_list = props.tags.reduce((acc, tagged_ids, tag) => {

      let opacity = (
        props.tag_being_edited.length > 0 ?
        (props.tag_being_edited === tag ? 1 : 0.2)
        : (
          props.tag_to_highlight.length > 0 ?
          (props.tag_to_highlight === tag ? 1 : 0.2)
          : 1
        )
      );

      let percentage = Math.floor((props.tags_sizes.get(tag) / props.total_volume)*100)

      let editing = (props.tag_being_edited === tag)
      let shoud_display_add = (props.focused_node_id !== undefined && !props.tags.get(tag).has(props.focused_node_id))

      let new_element = (
        <TagListItem
        key={tag}
        tag={tag}
        opacity={opacity}
        editing={editing}
        percentage={percentage}
        shoud_display_add={shoud_display_add}
        tag_number={tagged_ids.size}
        highlightTag={props.highlightTag(tag)}
        stopHighlightingTag={props.stopHighlightingTag}
        startEditingTag={props.startEditingTag(tag)}
        stopEditingTag={props.stopEditingTag}
        deleteTag={props.onDeleteTag(tag)}
        renameTag={props.onRenameTag(tag)}
        addTagToNode={props.onAddTag(tag, props.focused_node_id)}
        />
      );

      return acc === null ? [new_element] : [...acc, new_element]

    }, null)

    tags_content = (
      <div style={content_style} onMouseLeave={props.stopHighlightingTag}>
        {tags_list}
      </div>
    );
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

const mapStateToProps = state => {
  const database = selectDatabase(state)
  const icicle_state = selectIcicleState(state)
  const tag_list_state = selectTagListState(state)

  const tags = database.getAllTags().sortBy(t => -1 * t.size)
  const tags_sizes = database.getAllTagsSizes()
  const total_volume = database.volume()

  const sequence = icicle_state.isLocked() ? icicle_state.lock_sequence() : icicle_state.hover_sequence()
  const focused_node_id = sequence[sequence.length - 1]

  const tag_to_highlight = icicle_state.tag_to_highlight()

  const tag_being_edited = tag_list_state.tag_being_edited()

	return {
    tags,
    tags_sizes,
    tag_to_highlight,
    focused_node_id,
    tag_being_edited,
    total_volume
  }
}

const mapDispatchToProps = dispatch => {
  const highlightTag = (tag) => () => {
    dispatch(setTagToHighlight(tag))
  }

  const stopHighlightingTag = () => {
    dispatch(setNoTagToHighlight())
  }

  const startEditingTag = (tag) => () => {
    dispatch(setTagBeingEdited(tag))
  }

  const stopEditingTag = () => {
    dispatch(setNoTagBeingEdited())
  }

  const onRenameTag = (old_tag) => (new_tag) => {
    dispatch(renameTag(old_tag, new_tag))
    dispatch(commit())
  }

  const onDeleteTag = (tag) => () => {
    dispatch(deleteTag(tag))
    dispatch(setNoTagToHighlight())
    dispatch(commit())
  }

  const onAddTag = (tag, id) => () => {
    if(id !== undefined){
      dispatch(addTagged(tag,id))
      dispatch(commit())
    }
  }
 	return {
    highlightTag,
    stopHighlightingTag,
    startEditingTag,
    stopEditingTag,
    onRenameTag,
    onDeleteTag,
    onAddTag
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container