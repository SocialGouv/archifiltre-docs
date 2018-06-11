import React from 'react'
import { connect } from 'react-redux'

import { selectAppState } from 'reducers/root-reducer'
import { tr } from 'dict'
import Dashboard from 'components/dashboard'
import CtrlZ from 'components/ctrl-z'


const Presentational = props => {
  return (
    <div className='grid-x grid-padding-y align-middle'>
      <div className='cell auto'></div>
      <div className='cell small-3'>
        <h4 style={{lineHeight: '0.8em'}}>
          <b>{tr('Icicles')}</b><br />
          <span style={{fontSize: '0.65em'}}>v7 Gentle Gorilla<sup>beta</sup> - <a target="_blank" href="http://archifiltre.com/#changelog">{tr("What's new?")}</a></span>
        </h4>
      </div>
      <div className='cell small-8'>
        <Dashboard />
      </div>
      <div className='cell auto'></div>
    </div>
  )
}


const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
