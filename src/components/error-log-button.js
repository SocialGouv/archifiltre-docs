import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'button'

import { selectLogError } from 'reducers/root-reducer'
import { exportCsv } from 'csv'

import { generateRandomString } from 'random-gen'

import { tr } from 'dict'

const Presentational = props => {
  if(props.nb_errors > 0){
    return mkB(()=> {
      let report_name = 'error_log_report_'+generateRandomString(40)
      exportCsv(props.getCsv(),report_name)
      },
      (<span><i className='material-icons'>file_download</i><span> {tr("Errors")}</span></span>)
      )
  }
  else{
    return (<span></span>)
  }
  
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
