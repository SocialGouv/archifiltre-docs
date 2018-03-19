import React from 'react'
import { connect } from 'react-redux'

import { selectLogError } from 'reducers/root-reducer'
import { exportCsv } from 'csv'

import { generateRandomString } from 'random-gen'


const Presentational = props => {
  return (
    <button type="button" onClick={()=> {
      let report_name = 'error_log_report_'+generateRandomString(40)
      exportCsv(props.getCsv(),report_name)
    }}>Export error log</button>
  )
}


const mapStateToProps = state => {
  let logError = selectLogError(state)
  return {
    getCsv: () => logError.toCsv()
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
