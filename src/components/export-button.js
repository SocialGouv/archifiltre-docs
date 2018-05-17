import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'components/button'

import { selectDatabase } from 'reducers/root-reducer'

import { save, makeNameWithExt } from 'save'
import { tr } from 'dict'


const Presentational = props => {
  const name = makeNameWithExt(props.getSessionName(),'.json')
  return mkB(()=>{
    console.log('export')
    save(name, props.getJson())
  }, tr('Export'))
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    getJson: database.toJson,
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
