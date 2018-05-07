import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase } from 'reducers/root-reducer'

import TextAlignCenter from 'components/text-align-center'

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
      <div className='grid-y grid-frame align-center'>
        <div className='cell'>
          <TextAlignCenter>
            <img src='imgs/loading.gif' style={{'width': '50%', 'opacity': '0.3'}}/>
            <p>{tr("Files loaded")}: {this.props.nb_files}</p>
          </TextAlignCenter>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    nb_files: database.size(),
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
