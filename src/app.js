// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from 'reducers/root-reducer'

import MainSpace from 'components/main-space'
import Dashboard from 'components/dashboard'

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
          <div className="mdl-layout-spacer"></div>
            <div className="mdl-cell mdl-cell--6-col">
              <h4>{tr("Icicles")}</h4>
              <span>
                <em>
                  {tr("This app is compatible with Firefox and Chrome.")}<br />
                  {tr("Your data won't leave your computer. Only you can see what happens below.")}
                </em>
              </span>
            </div>
            <div className="mdl-layout-spacer"></div>
            <div className="mdl-layout-spacer"></div>
            <Dashboard />
              <MainSpace />
          </div>
    </Provider>,
    root_div
  )

}