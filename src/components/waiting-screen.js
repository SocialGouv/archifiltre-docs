import React from 'react'

import { tr } from 'dict'

import * as ObjectUtil from 'util/object-util'

const cell_style = {
  textAlign:'center'
}

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
          <div style={cell_style}>
            <img src='imgs/loading.gif' style={{'width': '50%', 'opacity': '0.3'}}/>
            <p>{tr("Files loaded")}: {this.props.nb_files}</p>
          </div>
        </div>
      </div>
    )
  }
}



export default (props) => {
  const api = props.api
  const database = api.database
  const nb_files = database.getWaitingCounter()

  props = ObjectUtil.compose({
    nb_files,
  },props)

  return (<Presentational {...props}/>)
}

