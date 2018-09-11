
import React from 'react'

import ReactDOM from 'react-dom'

import ErrorBoundary from 'components/error-boundary'
import MainSpace from 'components/main-space'
import Header from 'components/header'

import 'css/app.css'

import { generateRandomString } from 'random-gen'

import { Store } from 'reducers/store'




// import 'typeface-quicksand'






// import Analytics from 'electron-ga' // dev/prod

// const analytics = new Analytics('UA-115293619-2')

// analytics.send('pageview',{
//   dh:'https://archifiltre.electron/',
//   dp:'/electron/v9',
//   dt:'archifiltre',
// })








const app = () => {
  let root_div = document.createElement('div')
  root_div.setAttribute('id','root')

  if (document.body !== null) {
    document.body.appendChild(root_div)
  }


  ReactDOM.render(
    <ErrorBoundary>
      <Store>
        {props => {
          console.log(props)
          window.props = props
          return (
            <div className='grid-y grid-frame'>
              <div className='cell'>
                <Header api={props.api}/>
              </div>
              <div className='cell auto'>
                <MainSpace api={props.api}/>
              </div>
            </div>
          )
        }}
      </Store>
    </ErrorBoundary>
    ,
    root_div
  )
}

window.onload = app

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

window.ondragover = window.ondrop = (ev) => {
  ev.preventDefault()
}
