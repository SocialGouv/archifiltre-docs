import React from 'react'
// import { connect } from 'react-redux'

import { active_button } from 'css/app.css'


export function mkB (click_action, label, enabled, color, custom_style) {
  const default_button_style = {
    margin: 0,
    width: '90%',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: (color ? color : '#4d9e25'),
  }

  const button_style = Object.assign(default_button_style, custom_style);

  if(enabled){
    return (
      <button type='button' className={'clear button '+ active_button} onClick={click_action} style={button_style}>
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

export function mkTB (click_action, label, enabled, color, custom_style) {
  const default_button_style = {
    color: (color ? color : '#4d9e25'),
    backgroundColor: (enabled ? 'rgba(249, 154, 11, 0)' : 'rgba(249, 154, 11, 0.2)'),
    opacity: (enabled ? 1 : 0.7),
    transition : 'all 0.2s ease-out',
    WebkitTransition : 'all 0.2s ease-out',
    cursor: enabled ? 'pointer' : 'default'
  }

  const button_style = Object.assign(default_button_style, custom_style);
  
  if(enabled){
    return (
      <a className={'clear button '+ active_button} onClick={click_action} style={button_style}>
        {label}
      </a>
    )
  }
  else{
    return (
      <a className='clear button' style={button_style}>
        {label}
      </a>
    )
  }
}