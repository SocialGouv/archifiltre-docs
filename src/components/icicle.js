import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectLogError } from 'reducers/root-reducer'

import { setParentPath } from 'reducers/database'

import { tr } from 'dict'

import { plot } from 'sequences'


// dummy, just to keep same feel as original sequences.js
const chart_style = {
  position: 'relative',
  stroke: '#fff',
}


const Presentational = props => {
  return (
    <div>
      <div>
        <p>{props.nb_files} {tr("fichiers chargés")}.</p>
        <p>{props.nb_errors} {tr("erreurs")}.</p>
      </div>
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--10-col">
          <div className="mdl-grid" id='main' ref={(input) => {
              if (input) {
                console.time('plot')
                plot(props.csv, props.setParentPath, props.parent_path)
                console.timeEnd('plot')
              }
            }}>
            <div
              className="mdl-cell mdl-cell--12-col"
              id='sequence'></div>
            <div
              className="mdl-cell mdl-cell--12-col"
              id='chart'
              style={chart_style}></div>
          </div>
        </div>
        <div className="mdl-cell mdl-cell--2-col">
          <div id='sidebar'>
            <p>{tr("Légende")}</p>
            <div id='legend'></div>
          </div>
        </div>
      </div>
    </div>
  )
}



const mapStateToProps = state => {
  let database = selectDatabase(state)
  console.time('csv')
  let csv = database.toCsv()
  console.timeEnd('csv')
  let logError = selectLogError(state)

  return {
    csv,
    nb_files: database.size(),
    nb_errors: logError.size(),
    parent_path: database.parent_path(),
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    setParentPath: (...args) => dispatch(setParentPath(...args))
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
