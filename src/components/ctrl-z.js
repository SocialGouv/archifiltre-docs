import React from 'react'
import { connect } from 'react-redux'


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
    return (
      <div></div>
    )
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
