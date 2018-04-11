import React from 'react'
import { connect } from 'react-redux'

import * as Folder from 'folder'
import { create, fromCsv } from 'reducers/database'
import { startToLoadFiles, finishedToLoadFiles } from 'reducers/app-state'
import { logError } from 'reducers/log-error'

import { tr } from 'dict'

class Presentational extends React.Component {
  constructor(props) {
    super(props)

    this.style_dropzone = {
      height: '15em',
      border: '0.2em dashed #868686',
      borderRadius: '3em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginLeft: '5%',
      marginRight: '5%',
      marginTop: '3em'
    }

    this.style_placeholder = {
      fontFamily: '\'Quicksand\', sans-serif',
      fontSize: '3em',
      lineHeight: '1.2'
    }

    this.placeholder = tr("Drop a directory here!")
    this.placeholder_st = tr("You may also drop a CSV file previously exported from Icicle.")


    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDragover (e) {
    e.preventDefault()
  }

  handleDrop (e) {
    Folder.asyncHandleDrop(e,this.props.create,this.props.fromCsv,this.props.logError)
          .then(this.props.finishedToLoadFiles)
    this.props.startToLoadFiles()
  }

  render() {
    return (
     <div
       onDragOver={this.handleDragover}
       onDrop={this.handleDrop}
       style={this.style_dropzone}
       className="mdl-cell mdl-cell--12-col"
     >
       <div>
         <p style={this.style_placeholder}>
           {this.placeholder}
         </p>
         <p style={this.style_placeholder_st}>
           {this.placeholder_st}
         </p>
       </div>
     </div>
   )
  }
}


const mapStateToProps = state => {
  return {}
}
 
const mapDispatchToProps = dispatch => {
  return {
    create: (...args) => dispatch(create(...args)),
    fromCsv: (...args) => dispatch(fromCsv(...args)),
    logError: (...a) => dispatch(logError(...a)),
    startToLoadFiles: (...args) => dispatch(startToLoadFiles(...args)),
    finishedToLoadFiles: (...args) => dispatch(finishedToLoadFiles(...args)),
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
