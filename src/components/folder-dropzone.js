import React from 'react'

import AsyncHandleDrop from 'async-handle-drop'

import TextAlignCenter from 'components/text-align-center'

import { tr } from 'dict'


export default class FolderDropzone extends React.Component {
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
    this.disclaimer = (
      <em><br />
        {tr('Compatible with Firefox and Chrome.')}<br />
        {tr('Your data won\'t leave your computer. Only you can see what happens in this app.')}
      </em>
    );

    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDragover (e) {
    e.preventDefault()
  }

  handleDrop (e) {
    e.preventDefault()

    this.props.api.app_state.startToLoadFiles()
    AsyncHandleDrop(e.dataTransfer.files[0].path)
      .then(vfs => {
        console.log(vfs)
        this.props.api.database.set(vfs)

        this.props.api.app_state.finishedToLoadFiles()
        this.props.api.undo.commit()
      })
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
        <div className='cell'>
          <TextAlignCenter>
            <div>{this.disclaimer}</div>
          </TextAlignCenter>
        </div>
      </div>
    )
  }
}

