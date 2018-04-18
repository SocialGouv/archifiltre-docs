import React from 'react'
import { connect } from 'react-redux'

const button_style = {
  margin: 0
}

const round_button_style = {
  margin: 0
}

export function mkB (click_action, label) {
  return (
    <button type='button' className='button' onClick={click_action} style={button_style}>
      {label}
    </button>
  )
}

export function mkRB (click_action, label) {
  return (
    <button type='button' className='button' onClick={click_action} style={round_button_style}>
      {label}
    </button>
  )
}