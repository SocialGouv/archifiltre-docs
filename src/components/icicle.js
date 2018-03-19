import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectLogError } from 'reducers/root-reducer'


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
        <p>Number of files loaded : {props.nb_files}</p>
        <p>Number of errors : {props.nb_errors}</p>
      </div>
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--10-col">
          <div className="mdl-grid" id='main' ref={(input) => {
              console.time('plot')
              plot(props.csv)
              console.timeEnd('plot')
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
            <p>Legend :</p>
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
    nb_errors: logError.size()
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
