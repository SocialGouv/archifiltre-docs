import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'button'

import { selectDatabase } from 'reducers/root-reducer'
import { exportCsv } from 'csv'

import { tr } from 'dict'

const Presentational = props => {
  return mkB(()=>exportCsv(props.getCsv()), tr("Export"))
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
