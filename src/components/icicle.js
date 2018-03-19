import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectLogError } from 'reducers/root-reducer'


import { plot } from 'sequences'


const Presentational = props => {
  return (
    <div>
      <div>
        <p>Number of files loaded : {props.nb_files}</p>
        <p>Number of errors : {props.nb_errors}</p>
      </div>
      <div id='main' ref={(input) => {
          console.time('plot')
          plot(props.csv)
          console.timeEnd('plot')
        }}>
        <div id='sequence'>
        </div>
        <div id='chart'>
        </div>
      </div>
      <div id='sidebar'>
        <input type='checkbox' id='togglelegend' /> Legend<br/>
        <div id='legend' style={{visibility: 'hidden'}}></div>
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
