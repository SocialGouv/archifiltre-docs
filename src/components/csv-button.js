import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'components/button'

import { selectDatabase } from 'reducers/root-reducer'

import * as Csv from 'csv'
import { save } from 'save'
import { tr } from 'dict'

const Presentational = props => {
  return mkB(()=>{
    console.log('to csv')
    save('my.csv', Csv.toStr(props.getStrList2()))
  }, tr('to Csv'))
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    getStrList2: database.toStrList2
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
