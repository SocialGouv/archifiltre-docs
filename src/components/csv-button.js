import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'components/button'

import { selectDatabase } from 'reducers/root-reducer'

import * as Csv from 'csv'
import { save, makeNameWithExt } from 'save'
import { tr } from 'dict'


const Presentational = props => {
  const name = makeNameWithExt(props.getSessionName(),'csv')
  return mkB(
    ()=>{
      console.log('to csv')
      save(name, Csv.toStr(props.getStrList2()))
    },
    tr('Export'),
    true)
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    getStrList2: database.toStrList2,
    getSessionName: database.getSessionName,
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
