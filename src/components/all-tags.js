import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import { addTagged, deleteTagged, renameTag, deleteTag } from 'reducers/database'
import { setTagToHighlight, setNoTagToHighlight } from 'reducers/icicle-state'

import { tags_bubble, tags_count, tags_add, tags_cross, visibleonhover } from 'css/app.css'

// import ReactTooltip from 'react-tooltip'

// import { mkRB } from 'components/button'
import Tag from 'components/tag'
import TextAlignCenter from 'components/text-align-center'

import * as Color from 'color'
import { commit } from 'reducers/root-reducer'
import { tr } from 'dict'

const trimString = (s, max_length) => {
  return s.length > max_length+3 ? s.substring(0,max_length) + "..." : s
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

  // const mkTT = (tag) => (
  //   <ReactTooltip key={tag + "__tooltip"} className={visibleonhover} place="left" effect='solid' delayHide={100}>
  //     {mkRB(
  //       props.onAddTag(tag, props.focused_node_id),
  //       (<i className="fi-arrow-left"/>),
  //       true,
  //       '',
  //       {}
  //     )}
  //     {mkRB(
  //       props.onDeleteTag(tag),
  //       (<i className="fi-pencil"/>),
  //       true,
  //       '',
  //       {}
  //     )}
  //     {mkRB(
  //       props.onDeleteTag(tag),
  //       (<i className="fi-trash"/>),
  //       true,
  //       '',
  //       {}
  //     )}
  //   </ReactTooltip>
  // );

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
      let opacity = props.tag_to_highlight.length > 0 ? (tag === props.tag_to_highlight ? 1 : 0.2) : 1

      let delete_bubble = (
        <div className={tags_bubble + " " + tags_cross} onClick={props.onDeleteTag(tag)}>
          <i className='fi-x' />
        </div>
      );

      let shoud_display_add = (props.focused_node_id !== undefined && !props.tags.get(tag).has(props.focused_node_id))
      let count_or_add_bubble = (
        shoud_display_add ?
        (<div className={tags_bubble + " " + tags_add} onClick={props.onAddTag(tag, props.focused_node_id)}><i className='fi-plus' /></div>)
        : (<div className={tags_bubble + " " + tags_count}>{tagged_ids.size}</div>)
      );

      let new_element = (
        <div
        key={tag}
        data-tip={tag}
        onMouseEnter={(e)=> props.highlightTag(tag)}
        onMouseLeave={(e)=> props.stopHighlightingTag()}
        onClick={(e) => props.onAddTag(tag, props.focused_node_id)}
        style={{opacity, width:'20em'}}>
          {delete_bubble}
          {count_or_add_bubble}
          <Tag
            text={trimString(tag, 25)}
            editing={false}
            remove_handler={() => {}}
            />
        </div>);

      return acc === null ? [new_element] : [...acc, new_element]
    }, null)

    tags_content = (
      <div style={{fontSize: '0.8em', overflowY: 'auto', overflowX: 'hidden', maxHeight: '10.5em'}}>
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

  const sequence = icicle_state.isLocked() ? icicle_state.lock_sequence() : icicle_state.hover_sequence()
  const focused_node_id = sequence[sequence.length - 1]

  const tag_to_highlight = icicle_state.tag_to_highlight()

	return {
    tags: database.getAllTags().sortBy(t => -1 * t.size),
    tag_to_highlight,
    focused_node_id
  }
}

const mapDispatchToProps = dispatch => {
  const highlightTag = (tag) => {
    dispatch(setTagToHighlight(tag))
  }

  const stopHighlightingTag = () => {
    dispatch(setNoTagToHighlight())
  }

  const onRenameTag = (old_tag, new_tag) => {
    dispatch(renameTag(old_tag, new_tag))
    dispatch(commit())
  }

  const onDeleteTag = (tag) => () => {
    dispatch(deleteTag(tag))
    dispatch(commit())
    dispatch(setNoTagToHighlight())
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