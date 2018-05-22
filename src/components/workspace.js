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
import BTRButton from 'components/back-to-root-button'

const chart_style = {
  stroke: '#fff',
}

const btr_style = {
  textAlign: 'center',
  paddingTop: '2em'
}


const Presentational = props => {
  return (
    <div>
        <Report />
        <div className="grid-x grid-frame">
          <div className="cell small-2"></div>
          <div className="cell small-4" style={btr_style}>
            <BTRButton />
          </div>
          <div className="cell small-6"></div>
        </div>
        <div className="grid-x grid-frame">
          <div
            onClick={(e) => {props.unlock(); props.setNoFocus();}}
            className="cell small-8"
          >
            <Icicle />
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
  return {}
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
