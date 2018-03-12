import React from 'react'
import { connect } from 'react-redux'

import * as Folder from 'folder'
import { create, fromCsv } from 'reducers/database'
import { startToLoadFiles, finishedToLoadFiles } from 'reducers/app-state'

class Presentational extends React.Component {
  constructor(props) {
    super(props)

    this.style_dropzone = {
      height: '20em',
      border: '0.2em dashed #868686',
      borderRadius: '1em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }

    this.style_placeholder = {
      fontFamily: '\'Quicksand\', sans-serif',
      fontSize: '3em'
    }

    this.placeholder = 'Drop files or csv here !'


    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDragover (e) {
    e.preventDefault()
  }

  handleDrop (e) {
    Folder.asyncHandleDrop(e,this.props.create,this.props.fromCsv)
          .then(this.props.finishedToLoadFiles)
    this.props.startToLoadFiles()
  }

  render() {
    return (
      <div
        onDragOver={this.handleDragover}
        onDrop={this.handleDrop}
        style={this.style_dropzone}
      >
        <div style={this.style_placeholder}>
          {this.placeholder}
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
    create: a => {
      dispatch(create(a))
    },
    fromCsv: a => {
      dispatch(fromCsv(a))
    },
    startToLoadFiles: () => {
      dispatch(startToLoadFiles())
    },
    finishedToLoadFiles: () => {
      dispatch(finishedToLoadFiles())
    }
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
