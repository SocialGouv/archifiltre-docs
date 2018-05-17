import React from 'react'
import { connect } from 'react-redux'

import * as Folder from 'folder'
import { push, fromJson, makeTree, fromLegacyCsv } from 'reducers/database'
import { startToLoadFiles, finishedToLoadFiles } from 'reducers/app-state'
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
    this.placeholder_st = tr('You may also drop a JSON file previously exported from Icicle.')


    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDragover (e) {
    e.preventDefault()
  }

  handleDrop (e) {
    e.preventDefault()
    this.props.startToLoadFiles()
    Folder.asyncHandleDrop(e,this.props.push,this.props.fromJson,this.props.fromLegacyCsv)
      .then(shouldProcess => {
        if (shouldProcess) {
          return this.props.makeTree()
        }
      })
      .then(this.props.finishedToLoadFiles)
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
    push: (...args) => dispatch(push(...args)),
    makeTree: (...args) => dispatch(makeTree(...args)),
    sort: (...args) => dispatch(sort(...args)),
    fromJson: (...args) => dispatch(fromJson(...args)),
    fromLegacyCsv: (...args) => dispatch(fromLegacyCsv(...args)),
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
