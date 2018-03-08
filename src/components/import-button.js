import React from 'react'
import { connect } from 'react-redux'

import { fromCSV } from 'reducers/database'
import { finishedToLoadFiles } from 'reducers/app-state'

const Presentational = props => {
  return (
    <input type="file" onChange={e => importCsv(e,props.loadCSV,props.finish)} accept=".csv, .CSV"/>
  )
}

function importCsv(e,loadCSV,finish) {
  let file = e.currentTarget.files[0]
  let file_reader = new FileReader()
  file_reader.onload = e => {
    loadCSV(e.currentTarget.result)
    finish()
  }
  file_reader.readAsText(file)
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    loadCSV: csv => dispatch(fromCSV(csv)),
    finish: () => dispatch(finishedToLoadFiles())
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
