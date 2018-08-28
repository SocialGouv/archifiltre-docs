import React from 'react'
// import { connect } from 'react-redux'

import { mkB } from 'components/button'

// import { selectDatabase } from 'reducers/root-reducer'

import * as Csv from 'csv'
import { save, makeNameWithExt } from 'save'
import { tr } from 'dict'


export default CsvButton = props => {
  // let database = selectDatabase(state)
  // return {
  //   getStrList2: database.toStrList2,
  //   getSessionName: database.getSessionName,
  // }

  const name = () => makeNameWithExt(props.getSessionName(),'csv')
  return mkB(
    ()=>{
      console.log('to csv')
      save(name(), Csv.toStr(props.getStrList2()))
    },
    tr('Export'),
    true)
}

