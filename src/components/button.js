import React from 'react'
import { connect } from 'react-redux'

import { active_button } from 'css/app.css'


export function mkB (click_action, label, enabled, color, custom_style) {
  const default_button_style = {
    margin: 0,
    width: '90%',
    fontWeight: 'bold',
    backgroundColor: (color ? color : '#4d9e25'),
  }

  const button_style = Object.assign(default_button_style, custom_style);

  if(enabled){
    return (
      <button type='button' className={'button '+ active_button} onClick={click_action} style={button_style}>
        {label}
      </button>
    )
  }
  else{
    return (
      <button type='button' className='button' onClick={click_action} style={button_style} disabled>
        {label}
      </button>
    )
  }
}

export function mkRB (click_action, label, enabled, color, custom_style) {
  const default_button_style = {
    backgroundColor: (color ? color : '#4d9e25'),
    borderRadius: '50%',
  }

  const button_style = Object.assign(default_button_style, custom_style);
  
  if(enabled){
    return (
      <button type='button' className={'button '+ active_button} onClick={click_action} style={button_style}>
        {label}
      </button>
    )
  }
  else{
    return (
      <button type='button' className='button' onClick={click_action} style={button_style} disabled>
        {label}
      </button>
    )
  }
}