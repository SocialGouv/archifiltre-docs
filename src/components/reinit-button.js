import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'components/button'

import { reInit as re1 } from 'reducers/database-alt'
import { reInit as re2 } from 'reducers/app-state'
import { reInit as re3 } from 'reducers/log-error'

import { commit } from 'reducers/root-reducer'

import { tr } from 'dict'

const Presentational = props => {

  return mkB(props.reInitStateApp, tr("Reset"))
}



const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    reInitStateApp: (...args) => {
      dispatch(re1())
      dispatch(re2())
      dispatch(re3())
      dispatch(commit())
    }
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
