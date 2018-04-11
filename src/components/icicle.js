import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectLogError } from 'reducers/root-reducer'

import { setParentPath } from 'reducers/database'

import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import ErrorLogButton from 'components/error-log-button'

import { tr } from 'dict'

import { plot } from 'sequences'


// dummy, just to keep same feel as original sequences.js
const chart_style = {
  position: 'relative',
  stroke: '#fff',
}


const Presentational = props => {
  return (
    <div className="mdl-cell mdl-cell--12-col">
      <div className="mdl-grid" id="report">
            <div className="mdl-layout-spacer"></div>
            <div className="mdl-cell mdl-cell--3-col">
              <i className="material-icons" id="report-icon" style={{'fontSize': '4.5em'}}></i><br />
              <span  id="report-name" style={{'fontWeight': 'bold'}}></span><br /><span id="report-size"></span>
            </div>
            <div className="mdl-layout-spacer"></div>
      </div>


        <div className="mdl-grid" id='main' ref={(input) => {
          if (input) {
            console.time('plot')
            plot(props.csv, props.setParentPath, props.parent_path)
            console.timeEnd('plot')
          }
        }}>
          <div className="mdl-cell mdl-cell--8-col" id='chart' style={chart_style}>
            <div id='ruler' style={{'position':'absolute', 'bottom':'0', 'width':'100%', 'height': '50pt'}}></div>
          </div>
          <div id='sequence' className="mdl-cell mdl-cell--4-col" style={chart_style}></div>
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
