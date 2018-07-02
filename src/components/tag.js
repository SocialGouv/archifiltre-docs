import React from 'react'
import { connect } from 'react-redux'

import { deleteTagged } from 'reducers/database'

import { tags_bubble, tags_cross } from 'css/app.css'

import { commit } from 'reducers/root-reducer'
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

const component_style = {
  fontWeight: "bold",
  display: "inline-block",
  marginRight: "0.3em",
  marginBottom: "0.2em"
}

const Presentational = props => {
  let cross = (
    <div className={tags_bubble + " " + tags_cross} style={cross_style} onMouseUp={(e) => {e.stopPropagation(); props.remove_handler() }}>
     <i className='fi-x'></i>
    </div>);

  return (
    <div style={component_style} onClick={props.click_handler}>
      <div style={tag_style}>
        {props.text}
      </div>
      {props.editing ? cross : <span />}
    </div>
  )
}


const mapStateToProps = state => {

	return {}
}

const mapDispatchToProps = dispatch => {

 	return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
