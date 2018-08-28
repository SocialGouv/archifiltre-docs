
import React from 'react'

import ReactDOM from 'react-dom'

// import MainSpace from 'components/main-space'
// import Header from 'components/header'

import 'css/app.css'

// import ErrorBoundary from 'components/error-boundary'

import { generateRandomString } from 'random-gen'

import appState from 'reducers/app-state'
import icicleState from 'reducers/icicle-state'
import reportState from 'reducers/report-state'
import tagListState from 'reducers/tag-list-state'


const Baba = tagListState(reportState(icicleState(appState((props) => {
  console.log(props)
  window.props = props
  return (
    <div>
      tucetsauicertcuiaretcuitecuitrecui tuic ecuier tcuietcuiaretcuiacetauicuitaecautricetraui
    </div>
  )
}))))

const app = () => {
  let root_div = document.createElement('div')
  root_div.setAttribute('id','root')

  if (document.body !== null) {
    document.body.appendChild(root_div)
  }


  ReactDOM.render(
    <Baba/>,
    root_div
  )

  // ReactDOM.render(
  //   <div className='grid-y grid-frame'>
  //     <div className='cell'>
  //       <Header/>
  //     </div>
  //     <div className='cell auto'>
  //       <MainSpace/>
  //     </div>
  //   </div>,
  //   root_div
  // )
}

window.onload = app
