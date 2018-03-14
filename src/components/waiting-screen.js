import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase } from 'reducers/root-reducer'

class Presentational extends React.Component {
  constructor(props) {
    super(props)
    this.thres = 1000
    this.last_ms = 0

    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (this.props.nb_files === nextProps.nb_files) {
    //   this.forceUpdate()
    //   return false
    // }
    // let cur_ms = (new Date()).getTime()
    // if (cur_ms - this.last_ms < this.thres) {
    //   this.forceUpdate()
    //   return false
    // }
    // this.last_ms = cur_ms
    // this.forceUpdate()
    return true
  }

  render() {
    return (
      <div>
        <p>{this.props.nb_files}</p>
      </div>
    )
  }
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    nb_files: database.size()
    // nb_files: Math.floor(database.size()/1000)*1000
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
