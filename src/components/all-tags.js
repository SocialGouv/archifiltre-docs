import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import { addTagged, deleteTagged } from 'reducers/database'
import { setTagToHighlight, setNoTagToHighlight } from 'reducers/icicle-state'

import { tags, tags_count } from 'css/app.css'

import Tag from 'components/tag'
import TextAlignCenter from 'components/text-align-center'

import * as Color from 'color'
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

  else {
    let tags_list = props.tags.reduce((acc, tagged_ids, tag) => {
      let opacity = props.tag_to_highlight.length > 0 ? (tag === props.tag_to_highlight ? 1 : 0.2) : 1

      let new_element = (
        <div key={tag} onMouseEnter={(e)=> props.highlightTag(tag)} onMouseLeave={(e)=> props.stopHighlightingTag()} style={{opacity, width:'20em'}}>
          <div className={tags_count}>
            {tagged_ids.size}
          </div>
          <Tag
            text={trimString(tag, 25)}
            editing={false}
            remove_handler={() => {}}
            />
        </div>);

      return acc === null ? [new_element] : [...acc, new_element]
    }, null)

    tags_content = <div style={{fontSize: '0.8em', overflowY: 'auto', overflowX: 'hidden', maxHeight: '10.5em'}}>{tags_list}</div>;
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

  const tag_to_highlight = icicle_state.tag_to_highlight()

	return {
    tags: database.getAllTags().sortBy(t => -1 * t.size),
    tag_to_highlight
  }
}

const mapDispatchToProps = dispatch => {
  const highlightTag = (tag) => {
    dispatch(setTagToHighlight(tag))
  }

  const stopHighlightingTag = () => {
    dispatch(setNoTagToHighlight())
  }
 	return {
    highlightTag,
    stopHighlightingTag
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container