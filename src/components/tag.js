import React from 'react'
import { connect } from 'react-redux'

import { deleteTagged } from 'reducers/database'

import { commit } from 'reducers/root-reducer'
import { tr } from 'dict'

const tag_style = {
  display: "inline-block",
  color: "white",
  backgroundColor: "rgb(5, 120, 200)",
  borderRadius: "0.8em",
  padding: "0 1em",
  marginBottom: "0.3em",
}

const cross_style = {
  display: "inline-block",
  color: "white",
  backgroundColor: "rgb(0, 90, 170)",
  padding: "0 0.4em",
  borderRadius: "1em",
  marginRight: "0.3em",
  marginLeft: "-0.5em"
}

const component_style = {
  fontWeight: "bold",
  display: "inline-block",
  marginRight: "0.3em",
  marginBottom: "0.3em"
}

const Presentational = props => {
  let cross = (
    <div onMouseUp={(e) => {e.stopPropagation(); props.remove_handler() }} style={cross_style}>
     X 
    </div>);

  return (
    <div style={component_style}>
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
