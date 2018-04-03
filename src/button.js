import React from 'react'
import { connect } from 'react-redux'

const button_style = {
	width: '80%',
	margin: '0.2em',
	fontSize: '0.8em'
}

const round_button_style = {
	fontSize: '0.6em',
	margin: '1em'
}

export function mkB (click_action, label) {
	return (
    <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={click_action} style={button_style}>
    	{label}
    </button>
  )
}

export function mkRB (click_action, label) {
	return (
    <button type="button" className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" onClick={click_action} style={round_button_style}>
    	{label}
    </button>
  )
}