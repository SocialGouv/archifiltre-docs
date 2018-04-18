import React from 'react'
import { connect } from 'react-redux'

import * as Folder from 'folder'
import { create, fromCsv } from 'reducers/database-alt'
import { startToLoadFiles, finishedToLoadFiles } from 'reducers/app-state'
import { logError } from 'reducers/log-error'
import { commit } from 'reducers/root-reducer'

import TextAlignCenter from 'components/text-align-center'

import { tr } from 'dict'

class Presentational extends React.Component {
  constructor(props) {
    super(props)

    this.style_dropzone = {
      border: '0.2em dashed #868686',
      borderRadius: '3em',
    }

    this.style_placeholder = {
      fontSize: '3em',
    }

    this.placeholder = tr('Drop a directory here!')
    this.placeholder_st = tr('You may also drop a CSV file previously exported from Icicle.')


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
        className='grid-y grid-frame align-center'
        onDragOver={this.handleDragover}
        onDrop={this.handleDrop}
        style={this.style_dropzone}
      >
        <div className='cell'>
          <TextAlignCenter>
            <div style={this.style_placeholder}>{this.placeholder}</div>
          </TextAlignCenter>
        </div>
        <div className='cell'>
          <TextAlignCenter>
            <div>{this.placeholder_st}</div>
          </TextAlignCenter>
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
    finishedToLoadFiles: (...args) => {
      dispatch(finishedToLoadFiles(...args))
      dispatch(commit())
    },
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
