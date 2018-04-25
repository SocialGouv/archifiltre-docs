import React from 'react'
import { connect } from 'react-redux'

import { tr } from 'dict'

const Presentational = props => {

  return (<text
      className="breadcrumb-text"
      x={props.w/7}
      y={props.level*props.step}
      dx="0"
      dy={props.step/2 + 5}
      textAnchor="start"
      stroke="none"
      fontWeight={props.is_dummy ? "bold" : ""}>{props.text}</text>);
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
