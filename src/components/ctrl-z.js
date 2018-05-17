import React from 'react'
import { connect } from 'react-redux'


import { mkRB } from 'components/button'
import { undo, redo, hasAPast, hasAFuture } from 'reducers/root-reducer'

const round_button_style = {
  borderRadius: '50%'
}

class Presentational extends React.Component {
  constructor(props) {
    super(props)
    this.onKeyDownHandler = e => {
      if (e.ctrlKey === true) {
        if (e.key === 'z') {
          this.props.undo()
        } else if (e.key === 'Z') {
          this.props.redo()
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
        <div>
          <div className='grid-x grid-padding-x'>
            <div className='cell small-6'>
              {
                mkRB(
                  this.props.undo,
                  (<i className="fi-arrow-left" style={{fontSize: '2em'}}/>),
                  this.props.hasAPast
                )
              }
            </div>
            <div className='cell small-6'>
              {
                mkRB(
                  this.props.redo,
                  (<i className="fi-arrow-right" style={{fontSize: '2em'}}/>),
                  this.props.hasAFuture
                )
              }
            </div>
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


const mapStateToProps = state => {
  return {
    hasAPast: hasAPast(state),
    hasAFuture: hasAFuture(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo())
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
