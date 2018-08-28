import React from 'react'

import { mkTB } from 'components/button'

import TextAlignCenter from 'components/text-align-center'
import * as ObjectUtil from 'util/object-util'

import * as Color from 'color'

import { tr } from 'dict'

const Presentational = props => {

  
  let button_style = {
    margin: 0,
    padding: '0.3em 10%',
    fontSize: '1em',
    fontWeight: 'bold',
    borderRadius: '0.4em'
  }

  return (
    <div className='grid-x align-middle' style={{minWidth: '25em'}}>
      <div className='cell small-4'>
        <TextAlignCenter>{tr('Color code:')}</TextAlignCenter>
      </div>
      <div className='cell small-3'>
        <TextAlignCenter>{mkTB(props.toggleChangeSkin, tr('Type'), props.change_skin, Color.parentFolder(), button_style)}</TextAlignCenter>
      </div>
      <div className='cell small-3'>
        <TextAlignCenter>{mkTB(props.toggleChangeSkin, tr('Dates'), !props.change_skin, Color.parentFolder(), button_style)}</TextAlignCenter>
      </div>
    </div>
  )
}


export default (props) => {
  const api = props.api
  const icicle_state = api.icicle_state

  props = ObjectUtil.compose({
    change_skin: icicle_state.changeSkin(),
    toggleChangeSkin: icicle_state.toggleChangeSkin,
  },props)

  return (<Presentational {...props}/>)
}
