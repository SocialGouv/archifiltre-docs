import React from 'react'
import { connect } from 'react-redux'

import { plot } from 'sequences'
import { toCSV, getSize } from 'reducers/database'


const Presentational = props => {
  return (
    <div>
      <div>
        Number of files loaded : {props.nb_files}
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
  console.time('csv')
  let csv = toCSV(state)
  console.timeEnd('csv')

  return {
    csv,
    nb_files: getSize(state)
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
