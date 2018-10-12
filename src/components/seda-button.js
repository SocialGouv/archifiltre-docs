import React from 'react'

import { mkB } from 'components/button'

// import * as Csv from 'csv'
import { save, makeNameWithExt } from 'save'

import pick from 'languages'

const label = pick({
  en: 'SEDA',
  fr: 'SEDA',
})

const SedaButton = props => {
  const api = props.api
  const database = api.database
  // const getStrList2 = database.toStrList2
  const getManifestStr = database.toManifestStr
  const getSessionName = database.getSessionName

  const name = () => makeNameWithExt(getSessionName(),'xml')

  return mkB(
    ()=>{
      console.log('to SEDA')
      console.log(getManifestStr())
      save(name(), getManifestStr())
    },
    label,
    true,
    '#4d9e25',
    {width:'90%'}
  )
}

export default SedaButton