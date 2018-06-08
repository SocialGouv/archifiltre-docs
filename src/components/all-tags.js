import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import { addTagged, deleteTagged } from 'reducers/database'
import { setTagToHighlight, setNoTagToHighlight } from 'reducers/icicle-state'

import { tags, tags_count } from 'css/app.css'

import TextAlignCenter from 'components/text-align-center'

import * as Color from 'color'
import { tr } from 'dict'

const Presentational = props => {
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
        <div key={tag} onMouseEnter={(e)=> props.highlightTag(tag)} onMouseLeave={(e)=> props.stopHighlightingTag()} style={{opacity}}>
          <div className={tags_count}>
            {tagged_ids.size}
          </div>
          <div className={tags} style={{display:'inline-block'}}>
            <div>{tag}</div>
          </div>
        </div>);

      return acc === null ? [new_element] : [...acc, new_element]
    }, null)

    tags_content = <div style={{fontSize: '0.8em'}}>{tags_list}</div>;
  }

  return (
    <div style={{'opacity': (props.tags.size > 0 ? 1 : 0.5), 'background': 'white', 'borderRadius': '1em', height:'100%', padding:'0.5em 0.5em'}}>
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