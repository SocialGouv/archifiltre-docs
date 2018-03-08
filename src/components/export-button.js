import React from 'react'
import { connect } from 'react-redux'

import { Set } from 'immutable'

import { selectDatabase } from 'reducers/root-reducer'
import FileSaver from 'file-saver'

const Presentational = props => {
  return (
    <button type="button" onClick={()=>exportCsv(props.csv)}>Export</button>
  )
}

function exportCsv(csv) {
  var blob = new Blob([csv], {type: "text/plain;charset=utf-8"})
  let root_folders = Set(
      csv.split('\n')
      .map(s=>s.match(/^.*?\//))
      .filter(e=>e!==null)
      .map(e=>e[0].replace('/',''))
    )
    .toArray()
    .join('_')
  FileSaver.saveAs(blob, 'icicle_'+root_folders+'.csv')
}

const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    csv: database.toCSV()
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
