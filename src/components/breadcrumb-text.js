import React from 'react'
import { connect } from 'react-redux'

import { tr } from 'dict'

const Presentational = props => {

  return (<text
      className="breadcrumb-text"
      x="40"
      y={props.level*props.step}
      dx="0"
      dy={props.step/2 + props.step/10}
      textAnchor="start"
      stroke="none"
      fontWeight={props.isDummy ? "bold" : ""}>{props.text}</text>);
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
