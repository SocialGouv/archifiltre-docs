import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setParentPath } from 'reducers/database'
import { setNoFocus, unlock } from 'reducers/icicle-state'

import { tr } from 'dict'

import Icicle from 'components/icicle'
import Ruler from 'components/ruler'
import BreadCrumbs from 'components/breadcrumbs'
import Report from 'components/report'


const chart_style = {
  stroke: '#fff',
}


const Presentational = props => {
  return (
    <div>
        <Report />
        <div className="grid-x grid-frame" style={{marginTop: '1em'}}>
          <div
            onClick={(e) => {props.unlock(); props.setNoFocus();}}
            className="cell small-8"
          >
            <Icicle display_root={props.display_root}/>
            <Ruler />
          </div>
          <div className="cell small-4" style={chart_style}>
            <BreadCrumbs />
          </div>
        </div>
    </div>
  )
}



const mapStateToProps = state => {
  let database = selectDatabase(state)
  let display_root = selectIcicleState(state).display_root()

  return {
    parent_path: database.parent_path(),
    display_root
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    unlock: (...args) => dispatch((unlock(...args))),
    setParentPath: (...args) => dispatch(setParentPath(...args))
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
