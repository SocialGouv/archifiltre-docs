import React from 'react'

import { tags_bubble, tags_cross } from 'css/app.css'

const tag_style = {
  color: 'white',
  backgroundColor: 'rgb(10, 50, 100)',
  borderRadius: '0.5em',
  padding: '0 0.5em',
}

const cross_style = {
  marginLeft: '-0.3em',
}

const default_component_style = {
  fontWeight: 'bold',
  // marginRight: '0.3em',
  // marginBottom: '0.2em'
}

const Presentational = props => {
  const cross = (
    <div className={tags_bubble + ' ' + tags_cross} style={cross_style} onMouseUp={(e) => {e.stopPropagation(); props.remove_handler() }}>
      <i className='fi-x'></i>
    </div>
  )

  const custom_style = props.custom_style

  const component_style = Object.assign({}, default_component_style, custom_style);

  return (
    <div className='grid-x' style={component_style} onClick={props.click_handler}>
      <div className='cell shrink' style={tag_style}>
        {props.text}
      </div>
      <div className='cell shrink'>
        {props.editing ? cross : <span />}
      </div>
    </div>
  )
}


export default Presentational
