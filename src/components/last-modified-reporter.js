import React from 'react'

import { tr } from 'dict'

import TimeGradient from 'components/time-gradient'
import * as ObjectUtil from 'util/object-util'

const RedDot = (props) => {
  return (
    <div style={{
      height: '0.5em',
      width: '0.5em',
      backgroundColor: 'red',
      borderRadius: '50%',
      margin: 'auto'
    }}/>
  )
}

const BlackCursor = (props) => {
  return (
    <div style={{
      height: '1em',
      width: '0.2em',
      backgroundColor: 'black',
      margin: 'auto'
    }}/>
  )
}

const epochTimeToDateTime = (d) => {
  const res = new Date(d)

  const mm = res.getMonth() + 1 // getMonth() is zero-based
  const dd = res.getDate()

  return (
    [
      (dd>9 ? '' : '0') + dd,
      (mm>9 ? '' : '0') + mm,
      res.getFullYear()
    ].join('/')
    // + " " + tr("at") + " " +
    // [
    //   res.getHours(),
    //   res.getMinutes(),
    //   res.getSeconds(),
    // ].join(':')
  )
}

const Presentational = props => {
  const api = props.api

  const cursor_width = 0.75

  let lm_max = '...'
  let lm_median = '...'
  let lm_average = '...'
  let lm_min = '...'

  if (props.placeholder === false) {
    const node = props.getFfByFfId(props.id)

    lm_max = epochTimeToDateTime(node.get('last_modified_max'))
    lm_median = epochTimeToDateTime(node.get('last_modified_median'))
    lm_average = epochTimeToDateTime(node.get('last_modified_average'))
    lm_min = epochTimeToDateTime(node.get('last_modified_min'))
  }

  return (
    <div className='grid-x align-middle'>

      <div className='cell small-12'>
        <b>{tr('Last modified')} :</b>
      </div>

      <div className='cell small-1'>
        <BlackCursor/>
      </div>
      <div className='cell small-5'>
        {tr('min')} :
      </div>
      <div className='cell small-6'>
        {lm_min}
      </div>

      <div className='cell small-1'>
        <RedDot/>
      </div>
      <div className='cell small-5'>
        {tr('average')} :
      </div>
      <div className='cell small-6'>
        {lm_average}
      </div>

      <div className='cell small-1'>
        <BlackCursor/>
      </div>
      <div className='cell small-5'>
        {tr('median')} :
      </div>
      <div className='cell small-6'>
        {lm_median}
      </div>

      <div className='cell small-1'>
        <BlackCursor/>
      </div>
      <div className='cell small-5'>
        {tr('max')} :
      </div>
      <div className='cell small-6'>
        {lm_max}
      </div>



      <div className='cell small-12' style={{paddingTop: '0.5em'}}>
        <TimeGradient api={api}/>
      </div>


    </div>
  )
}


export default (props) => {
  const api = props.api
  const database = api.database

  props = ObjectUtil.compose({
    getFfByFfId: database.getFfByFfId,
  },props)

  return (<Presentational {...props}/>)
}
