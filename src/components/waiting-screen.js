import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase } from 'reducers/root-reducer'


const Presentational = props => {
  return (
    <div>
      {props.nb_files}
    </div>
  )
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    nb_files: database.size()
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
