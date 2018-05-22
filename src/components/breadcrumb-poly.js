import React from 'react'
import { connect } from 'react-redux'


const Presentational = props => {
  const x = props.x
  const y = props.y
  const dx = props.dx
  const dy = props.dy
  const notch = dy/10

  const points = []
  const coord2Str = (x,y) => x+','+y
  const pushPoints = (x,y) => points.push(coord2Str(x,y))

  pushPoints(x,y)
  if (props.is_first === false) {
    pushPoints(x+dx/2, y+notch)
  }
  pushPoints(x+dx,y)
  pushPoints(x+dx,y+dy)
  if (props.is_last === false) {
    pushPoints(x+dx/2, y+dy+notch)
  }
  pushPoints(x,y+dy)


  return (
    <polygon
      className='breadcrumb-poly'
      points={points.join(' ')}
      fill={props.fill_color}
    />
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
