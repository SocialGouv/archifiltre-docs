import React from 'react'
import { connect } from 'react-redux'

import { deleteTagged } from 'reducers/database'

import { commit } from 'reducers/root-reducer'
import { tr } from 'dict'

const tag_style = {
  fontWeight: "bold",
  display: "inline-block",
  color: "white",
  backgroundColor: "rgb(5, 120, 200)",
  borderRadius: "0.8em",
  padding: "0 0.2em 0 1em",
  margin: "0 0.3em 0.3em 0",
}

const cross_style = {
  fontWeight: "bold",
  color: "white",
  backgroundColor: "none",
  padding: "0 0.4em",
  borderRadius: "1em",
  margin: "0 0 0 0.5em"
}

const dummy_style={
  paddingLeft: "1em"
}

const Presentational = props => {
  let cross = (
    <span onClick={(e) => {e.stopPropagation(); props.remove_handler() }} style={cross_style}>
     X 
    </span>);

  return (
    <div style={tag_style}>
      {props.text}
      {props.editing ? cross : <span style={dummy_style} />}
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
