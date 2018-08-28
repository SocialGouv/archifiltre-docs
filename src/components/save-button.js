import React from 'react'

import { mkB } from 'components/button'

import { save, makeNameWithExt } from 'save'
import { tr } from 'dict'


const SaveButton = props => {
  const api = props.api
  const database = api.database
  const getJson = database.toJson
  const getSessionName = database.getSessionName


  const name = () => makeNameWithExt(getSessionName(),'json')
  return mkB(
    ()=>{
      save(name(), getJson())
    },
    tr('Save'),
    true
  )
}

export default SaveButton