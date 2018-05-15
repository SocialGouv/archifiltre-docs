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
      <div className='cell small-6'>
        <h4 style={{lineHeight: '0.8em'}}>
          <b>{tr('Icicles')}</b><br />
          <span style={{fontSize: '0.65em'}}>v5 Elegant Elephant - <a target="_blank" href="http://archifiltre.com/#changelog">{tr("What's new?")}</a></span>
        </h4>
        <span>
          <em>
            {tr('Compatible with Firefox and Chrome.')}<br />
            {tr('Your data won\'t leave your computer. Only you can see what happens below.')}
          </em>
        </span>
      </div>
      <div className='cell auto'></div>
      <div className='cell small-2'>
        <Dashboard />
      </div>
      <div className='cell auto'></div>
      <div className='cell small-2'>
        {props.started === props.finished && <CtrlZ visible={true}/>}
      </div>
      <div className='cell auto'></div>
    </div>
  )
}


const mapStateToProps = state => {
  let app_state = selectAppState(state)
  return {
    started: app_state.isStarted(),
    finished: app_state.isFinished()
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
