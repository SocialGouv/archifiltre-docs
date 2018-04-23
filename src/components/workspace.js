import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase } from 'reducers/root-reducer'

import { setParentPath } from 'reducers/database-alt'
import { setNoFocus } from 'reducers/icicle-state'

import ExportButton from 'components/export-button'
import ReinitButton from 'components/reinit-button'
import ErrorLogButton from 'components/error-log-button'

import { tr } from 'dict'

import Icicle from 'components/icicle'
import Ruler from 'components/ruler'


// dummy, just to keep same feel as original sequences.js
const chart_style = {
  position: 'relative',
  stroke: '#fff',
  // 'background-color': 'rgba(100,100,100,0.1)'
}

const ruler_style = {
  'width':'100%',
  'height': '50pt',
  // 'background-color': 'rgba(100,100,100,0.2)'
}

 //     <div className="mdl-grid" id="report">
 //           <div className="mdl-layout-spacer"></div>
 //           <div className="mdl-cell mdl-cell--3-col">
 //             <i className="material-icons" id="report-icon" style={{'fontSize': '4.5em'}}></i><br />
 //             <span  id="report-name" style={{'fontWeight': 'bold'}}></span><br /><span id="report-size"></span>
 //           </div>
 //           <div className="mdl-layout-spacer"></div>
 //     </div>

const Presentational = props => {
  return (
      <div className="grid-x grid-frame" id='main'>
        <div
          onClick={(e) => {props.setNoFocus();}}
          className="cell small-8"
        >
          <Icicle nodes={props.nodes} />
          <Ruler style={ruler_style} />
        </div>
        <div className="cell small-4" style={chart_style}>
        </div>
      </div>
  )
}



const mapStateToProps = state => {
  let database = selectDatabase(state)
  console.time('JSON')
  let nodes = database.jsObject()
  console.timeEnd('JSON')

  return {
    nodes,
    parent_path: database.parent_path(),
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    setParentPath: (...args) => dispatch(setParentPath(...args))
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
