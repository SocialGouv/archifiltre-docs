import React from 'react'

import * as ObjectUtil from 'util/object-util'
import { mkB, mkRB } from 'components/button'

import * as Color from 'color'

import pick from 'languages'

const label = pick({
  en: 'Back to root',
  fr: 'Retour à la racine',
})


const Presentational = props => {

  const button_style = {
    transition : 'all 0.2s ease-out',
    WebkitTransition : 'all 0.2s ease-out',
    padding:'0.3em 0.45em',
    margin:'0',
    borderRadius: '2em'
  }

  let cursor_style = {cursor: props.isZoomed ? 'pointer' : 'default', padding:'0.3em 0.45em'}

  return mkB(
    props.backToRoot,
    (<span><i className="fi-zoom-out" />&ensp;{label}</span>),
    props.isZoomed,
    Color.parentFolder(),
    button_style)
}


export default (props) => {
  const api = props.api
  const icicle_state = api.icicle_state

  const backToRoot = () => {
    icicle_state.setNoDisplayRoot()
    icicle_state.setNoFocus()
    api.undo.commit()
  }

  props = ObjectUtil.compose({
    isZoomed: icicle_state.isZoomed(),
    backToRoot,
  },props)

  return (<Presentational {...props}/>)
}

