import React from 'react'
import { connect } from 'react-redux'

import { tr } from 'dict'

const Presentational = props => {
  return (<polygon
      className="breadcrumb-poly"
      points={makePoints(props.level, props.step, props.w, props.type)}
      fill={props.type.color} />);
}

const makePoints = (level, step, w, type) => {
  let h = step
  let y = level*(step)
  let t = h/10
  let w2 = w/20

  const coord2Str = (x,y) => (x+20)+','+y

  let points = [];

  points.push(coord2Str(0,y));
  if (level > 1) { // Topmost breadcrumb; don't include upper notch.
    points.push(coord2Str(w2/2,y+t));
  }
  points.push(coord2Str(w2,y));
  points.push(coord2Str(w2,y+h));

  if(type.label === tr("Folder") || type.label === tr("Root")){
    points.push(coord2Str(w2/2,y+h+t)); // lower notch
  }

  points.push(coord2Str(0,y+h));
  return points.join(" ");
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
