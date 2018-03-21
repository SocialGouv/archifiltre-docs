import React from 'react'
import { connect } from 'react-redux'

import { reInit as re1 } from 'reducers/database'
import { reInit as re2 } from 'reducers/app-state'

import { tr } from 'dict'

const Presentational = props => {
  return (
    <button type="button" onClick={props.reInitStateApp}>{tr("Reset")}</button>
  )
}


const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    reInitStateApp: (...args) => {
      dispatch(re1())
      dispatch(re2())
    }
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
