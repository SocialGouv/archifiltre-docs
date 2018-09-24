import React from 'react'

import { tags_bubble, tags_cross } from 'css/app.css'

const tag_style = {
  color: 'white',
  backgroundColor: 'rgb(10, 50, 100)',
  borderRadius: '0.5em',
  padding: '0 0.5em',
}

const default_component_style = {
  fontWeight: 'bold',
}

const Presentational = props => {
  const cross = (
    <div className={tags_bubble + ' ' + tags_cross} onMouseUp={(e) => {e.stopPropagation(); props.remove_handler() }}>
      <i className='fi-x'></i>
    </div>
  )

  const custom_style = props.custom_style

  const component_style = Object.assign({}, default_component_style, custom_style);

  return (
    <div className='grid-x' style={component_style} onClick={props.click_handler}>
      <div className='cell shrink' style={{paddingRight:'0em'}}>
        <div style={tag_style}>
          {props.text}
        </div>
      </div>
      <div className='cell shrink' style={{marginLeft:'-0.3em'}}>
        {props.editing ? cross : <span />}
      </div>
    </div>
  )
}


export default Presentational
