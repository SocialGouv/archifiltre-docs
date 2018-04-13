import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectLogError } from 'reducers/root-reducer'
import { tr } from 'dict'

class Presentational extends React.Component {
  constructor(props) {
    super(props)
    this.thres = 30
    this.last_ms = 0

    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.nb_files === nextProps.nb_files) {
      return false
    }
    let cur_ms = (new Date()).getTime()
    if (cur_ms - this.last_ms < this.thres) {
      return false
    }
    this.last_ms = cur_ms
    return true
  }

  render() {
    return (
      <div className="mdl-cell mdl-cell--12-col" style={{'textAlign':'center', 'marginTop':'3em'}}>
        <p>{tr("Files loaded")}: {this.props.nb_files}</p>
        <p>{tr("Errors")} : {this.props.nb_errors}</p>
      </div>
    )
  }
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  let logError = selectLogError(state)

  return {
    nb_files: database.size(),
    nb_errors: logError.size()
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
