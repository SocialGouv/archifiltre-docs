import React from 'react'
import { connect } from 'react-redux'


import { mkB } from 'components/button'
import { undo, redo, hasAPast, hasAFuture } from 'reducers/root-reducer'


const button = (onClick, label, enabled) => {
  if (enabled) {
    return (
      <button type='button' className='button' onClick={onClick}>
        {label}
      </button>
    )
  } else {
    return (
      <button type='button' className='button' onClick={onClick} disabled>
        {label}
      </button>
    )
  }
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
              {button(this.props.undo, '<=', this.props.hasAPast)}
            </div>
            <div className='cell small-6'>
              {button(this.props.redo, '=>', this.props.hasAFuture)}
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
