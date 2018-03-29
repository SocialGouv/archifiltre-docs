import React from 'react'
import { connect } from 'react-redux'

const button_style = {
	width: '80%',
	margin: '0.2em'
}

export function mkB (click_action, label) {
	return (
    <button type="button" onClick={click_action} style={button_style}>{label}</button>
  )
}