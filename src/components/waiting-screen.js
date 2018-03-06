import React from 'react'
import { connect } from 'react-redux'

import { getSize } from 'reducers/database'


const Presentational = props => {
  return (
    <div>
      {props.nb_files}
    </div>
  )
}


const mapStateToProps = state => {
  return {
    nb_files: getSize(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
