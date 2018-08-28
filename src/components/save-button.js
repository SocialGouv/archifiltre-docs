import React from 'react'
// import { connect } from 'react-redux'

import { mkB } from 'components/button'

// import { selectDatabase } from 'reducers/root-reducer'

import { save, makeNameWithExt } from 'save'
import { tr } from 'dict'


export default SaveButton = props => {
  let database = selectDatabase(state)
  // return {
  //   getJson: database.toJson,
  //   getSessionName: database.getSessionName,
  // }


  const name = () => makeNameWithExt(props.getSessionName(),'json')
  return mkB(
    ()=>{
      save(name(), props.getJson())
    },
    tr('Save'),
    true
  )
}
