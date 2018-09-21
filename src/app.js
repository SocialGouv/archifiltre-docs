
import React from 'react'

import ReactDOM from 'react-dom'

import ErrorBoundary from 'components/error-boundary'
import MainSpace from 'components/main-space'
import Header from 'components/header'

import 'css/app.css'

import { generateRandomString } from 'random-gen'

import { Store } from 'reducers/store'

import version from 'version'



document.title = 'stalactite v'+version+' - archifiltre'


// import Analytics from 'electron-ga' // development

// const analytics = new Analytics('UA-115293619-2') // development

// analytics.send('pageview',{ // development
//   dh:'https://archifiltre.electron/', // development
//   dp:'/electron/v9', // development
//   dt:'archifiltre', // development
// }) // development








const app = () => {
  let root_div = document.createElement('div')
  root_div.setAttribute('id','root')

  if (document.body !== null) {
    document.body.appendChild(root_div)
  }


  ReactDOM.render(
      <Store>
        {props => {
          const api = props.api
          return (
            <ErrorBoundary api={api}>
              <div className='grid-y grid-frame'>
                <div className='cell'>
                  <Header api={api}/>
                </div>
                <div className='cell auto'>
                  <MainSpace api={api}/>
                </div>
              </div>
            </ErrorBoundary>
          )
        }}
      </Store>
    ,
    root_div
  )
}

window.onload = app

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
  return false
}

window.ondragover = window.ondrop = (ev) => {
  ev.preventDefault()
  return false
}
