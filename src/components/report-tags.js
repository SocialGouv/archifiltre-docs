import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase } from 'reducers/root-reducer'
import { addTagged, deleteTagged } from 'reducers/database'

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
      let new_element = (
        <div key={tag}>
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
    <div style={{'opacity': (props.tags.size > 0 ? 1 : 0.5), 'background': 'white', 'borderRadius': '1em', height:'100%', padding:'0.5em 1em'}}>
      <TextAlignCenter>
        <b>{tr('All tags')}</b>
      </TextAlignCenter>
        {tags_content}
    </div>
  )
}

const mapStateToProps = state => {
  let database = selectDatabase(state)

	return {
    tags: database.getAllTags(),
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