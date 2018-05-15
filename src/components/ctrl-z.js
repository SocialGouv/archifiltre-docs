import React from 'react'
import { connect } from 'react-redux'


import { mkB } from 'components/button'
import { undo, redo } from 'reducers/root-reducer'


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
              mkB(this.props.undo,(<i className="fi-arrow-left" style={{fontSize: '2em'}}/>))
            }
            </div>
            <div className='cell small-6'>
            {
              mkB(this.props.redo,(<i className="fi-arrow-right" style={{fontSize: '2em'}}/>))
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
  return {}
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
