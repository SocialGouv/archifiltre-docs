import React from 'react'

import Dashboard from 'components/dashboard'

import pick from 'languages'

const title = pick({
  en: 'Icicles',
  fr: 'Stalactites',
})

const what_new = pick({
  en: 'What\'s new?',
  fr: 'Quoi de neuf ?',
})


const Header = props => {
  return (
    <div className='grid-x grid-padding-y align-middle'>
      <div className='cell auto'></div>
      <div className='cell small-3'>
        <h4 style={{lineHeight: '0.8em'}}>
          <b>{title}</b><br />
          <span style={{fontSize: '0.65em'}}>
            v8 Hipster Hippo -
            <a target="_blank" href="http://archifiltre.com/#changelog">{what_new}</a>
          </span>
        </h4>
      </div>
      <div className='cell small-8'>
        <Dashboard api={props.api}/>
      </div>
      <div className='cell auto'></div>
    </div>
  )
}

export default Header
