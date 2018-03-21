// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from 'reducers/root-reducer'

import MainSpace from 'components/main-space'

import unsafeStyle from 'css/main.css'

import { tr } from 'dict'


window.onload = function () {
  let root_div = document.createElement('div')
  root_div.setAttribute('id','root')

  if (document.body !== null) {
    document.body.append(root_div)
  }

  let store = createStore(rootReducer)

  ReactDOM.render(
    <Provider store={store}>
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--12-col">
          {tr("This app is compatible with Firefox and Chrome.")}
        </div>
        <div className="mdl-cell mdl-cell--12-col">
          <MainSpace />
        </div>
      </div>
    </Provider>,
    root_div
  )

}