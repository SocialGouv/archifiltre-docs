import React from 'react'

import { mkB } from 'components/button'

import pick from 'languages'

const label = pick({
  en: 'Close',
  fr: 'Fermer',
})

const ReinitButton = props => {
  const api = props.api
  const database = api.database
  const app_state = api.app_state
  const icicle_state = api.icicle_state
  const undo = api.undo
  const reInitStateApp = () => {
    database.reInit()
    app_state.reInit()
    icicle_state.setNoFocus()
    icicle_state.setNoDisplayRoot()
    undo.commit()
  }

  return mkB(reInitStateApp, label, true, "#e04d1c")
}

export default ReinitButton