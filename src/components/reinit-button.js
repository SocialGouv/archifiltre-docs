import React from 'react'
import { connect } from 'react-redux'

import { mkRB } from 'button'

import { reInit as re1 } from 'reducers/database'
import { reInit as re2 } from 'reducers/app-state'
import { reInit as re3 } from 'reducers/log-error'

import { tr } from 'dict'

const Presentational = props => {

  return mkRB(props.reInitStateApp, (<i className='material-icons'>power_settings_new</i>))
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
    }
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
