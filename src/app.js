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
  let root_div = document.createElement('main')
  root_div.setAttribute('id','root')
  root_div.setAttribute('className','mdl-layout__content')

  if (document.getElementById("container") !== null) {
    document.getElementById("container").appendChild(root_div)
  }

  let store = createStore(rootReducer)

  ReactDOM.render(

    <Provider store={store}>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col" style={{'textAlign':'center'}}>
              <p>{tr("This app is compatible with Firefox and Chrome.")}</p>
            </div>
            <div className="mdl-cell mdl-cell--12-col">
              <MainSpace />
            </div>
          </div>
    </Provider>,
    root_div
  )

}