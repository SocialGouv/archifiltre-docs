import React from 'react'
import { connect } from 'react-redux'

import { mkRB } from 'button'

import { selectDatabase } from 'reducers/root-reducer'
import { exportCsv } from 'csv'

import { tr } from 'dict'

const Presentational = props => {

  return mkRB(()=>exportCsv(props.getCsv()), (<i className='material-icons'>save</i>))
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    getCsv: () => database.toCsvNoFilter()
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
