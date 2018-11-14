
import React from 'react'

import ReactDOM from 'react-dom'

import ErrorBoundary from 'components/error-boundary'
import MainSpace from 'components/main-space'
import Header from 'components/header'
import ANewVersionIsAvailable from 'components/a-new-version-is-available'

import WindowResize from 'components/window-resize'

import 'css/app.css'

import { generateRandomString } from 'random-gen'

import { Store } from 'reducers/store'

import version from 'version'
import pick from 'languages'



document.title = pick({
  en:'icicle v'+version+' - archifiltre',
  fr:'stalactite v'+version+' - archifiltre',
})


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
            <WindowResize/>
            <div className='grid-y grid-frame'>
              <div className='cell'>
                <ANewVersionIsAvailable/>
              </div>
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
