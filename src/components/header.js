import React from 'react'

import { tr } from 'dict'
import Dashboard from 'components/dashboard'


export default function(props) {
  return (
    <div className='grid-x grid-padding-y align-middle'>
      <div className='cell small-1'></div>
      <div className='cell small-6'>
        <h4>{tr('Icicles')}</h4>
        <span>
          <em>
            {tr('This app is compatible with Firefox and Chrome.')}<br />
            {tr('Your data won\'t leave your computer. Only you can see what happens below.')}
          </em>
        </span>
      </div>
      <div className='cell small-1'></div>
      <div className='cell small-1'></div>
      <div className='cell small-3'>
        <Dashboard />
      </div>
    </div>
  )
}