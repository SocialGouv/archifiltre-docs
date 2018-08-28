import React from 'react'

import { mkRB } from 'components/button'

const round_button_style = {
  borderRadius: '50%'
}

const arrow_style = {
  fontSize: '1.6em',
}


class CtrlZ extends React.Component {
  constructor(props) {
    super(props)

    this.onKeyDownHandler = e => {
      if (e.ctrlKey === true) {
        if (e.key === 'z') {
          this.props.api.undo.undo()
        } else if (e.key === 'Z') {
          this.props.api.undo.redo()
        }
      }
    }

    document.body.addEventListener('keydown',this.onKeyDownHandler,false)

    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown',this.onKeyDownHandler,false)
  }

  render() {
  
    if (this.props.visible) {
      return (
          <div className='grid-x grid-padding-x'>
            <div className='cell small-6'>
              {
                mkRB(
                  this.props.api.undo.undo,
                  (<i className="fi-arrow-left" style={arrow_style}/>),
                  this.props.api.undo.hasAPast(),
                  '',
                  {marginBottom: '0'}
                )
              }
            </div>
            <div className='cell small-6'>
              {
                mkRB(
                  this.props.api.undo.redo,
                  (<i className="fi-arrow-right" style={arrow_style}/>),
                  this.props.api.undo.hasAFuture(),
                  '',
                  {marginBottom: '0'}
                )
              }
            </div>
          </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}


export default CtrlZ
