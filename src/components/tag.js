import React from 'react'

import { tags_bubble, tags_cross } from 'css/app.css'

import { tr } from 'dict'

const tag_style = {
  display: "inline-block",
  color: "white",
  backgroundColor: "rgb(10, 50, 100)",
  borderRadius: "0.5em",
  padding: "0 0.5em",
}

const cross_style = {
  marginLeft: "-0.3em"
}

const default_component_style = {
  fontWeight: "bold",
  display: "inline-block",
  marginRight: "0.3em",
  marginBottom: "0.2em"
}

const Presentational = props => {
  const cross = (
    <div className={tags_bubble + " " + tags_cross} style={cross_style} onMouseUp={(e) => {e.stopPropagation(); props.remove_handler() }}>
     <i className='fi-x'></i>
    </div>);

  const custom_style = props.custom_style

  const component_style = Object.assign({}, default_component_style, custom_style);

  return (
    <div style={component_style} onClick={props.click_handler}>
      <div style={tag_style}>
        {props.text}
      </div>
      {props.editing ? cross : <span />}
    </div>
  )
}


export default Presentational
