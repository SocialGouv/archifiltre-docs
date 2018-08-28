import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase } from 'reducers/root-reducer'
import { tr } from 'dict'

import TimeGradient from 'components/time-gradient'


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
  const cursor_width = 0.75

  let c_lm_max = '...'
  let c_lm_median = '...'
  let c_lm_average = '...'
  let c_lm_min = '...'

  if (props.placeholder === false) {
    const node = props.getByID(props.id)
    const n_content = node.get('content')

    const c_last_modified = n_content.get('last_modified')
    c_lm_max = epochTimeToDateTime(c_last_modified.get('max'))
    c_lm_median = epochTimeToDateTime(c_last_modified.get('median'))
    c_lm_average = epochTimeToDateTime(c_last_modified.get('average'))
    c_lm_min = epochTimeToDateTime(c_last_modified.get('min'))
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
        {c_lm_min}
      </div>

      <div className='cell small-1'>
        <RedDot/>
      </div>
      <div className='cell small-5'>
        {tr('average')} :
      </div>
      <div className='cell small-6'>
        {c_lm_average}
      </div>

      <div className='cell small-1'>
        <BlackCursor/>
      </div>
      <div className='cell small-5'>
        {tr('median')} :
      </div>
      <div className='cell small-6'>
        {c_lm_median}
      </div>

      <div className='cell small-1'>
        <BlackCursor/>
      </div>
      <div className='cell small-5'>
        {tr('max')} :
      </div>
      <div className='cell small-6'>
        {c_lm_max}
      </div>



      <div className='cell small-12' style={{paddingTop: '0.5em'}}>
        <TimeGradient/>
      </div>


    </div>
  )
}


const mapStateToProps = state => {
  const database = selectDatabase(state)

  return {
    getByID: database.getByID,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container