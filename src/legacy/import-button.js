import React from 'react'
import { connect } from 'react-redux'

import { generateRandomString } from 'random-gen'

import { fromCsv } from 'reducers/database'
import { finishedToLoadFiles } from 'reducers/app-state'
import { commit } from 'reducers/root-reducer'

import { readFile } from 'folder'
import { tr } from 'dict'

import unsafeStyle from 'css/import-button.css'
import wrapper from 'css/wrapper.js'
const style = wrapper(unsafeStyle)


const Presentational = props => {
  let id = generateRandomString(40)
  return (
    <div className={style.container()}>
      <label htmlFor={id} className={style.labelFile()}>{tr("Import from CSV")}</label>
      <input
        id={id}
        className={style.inputFile()}
        type="file"
        onChange={e => importCsv(e,props.loadCsv,props.finish)}
        accept=".csv, .CSV"
      />
    </div>
  )
}

function importCsv(e,loadCsv,finish) {
  let file = e.currentTarget.files[0]
  readFile(file).then(csv => {
    loadCsv(csv)
    finish()
  })
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    loadCsv: csv => dispatch(fromCsv(csv)),
    finish: () => {
      dispatch(finishedToLoadFiles())
      dispatch(commit())
    }
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
