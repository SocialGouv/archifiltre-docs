import React from 'react'
import { connect } from 'react-redux'

import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import { addTagged, deleteTagged } from 'reducers/database'
import { setTagToHighlight, setNoTagToHighlight } from 'reducers/icicle-state'

import { tags, tags_count } from 'css/app.css'

import BTRButton from 'components/back-to-root-button'
import ToggleChangeSkin from 'components/toggle-change-skin'

import * as Color from 'color'
import { tr } from 'dict'

const grid_style ={
  background: 'white',
  borderRadius: '5em',
  minHeight: '2.5em',
  maxHeight:'2.5em',
  padding: '0.2em 1em',
  margin: '0.5em 0'
}

const Presentational = props => {

  return (
    <div style={grid_style} className='grid-x align-middle'>
      <div className='cell small-4'>
        <BTRButton />
      </div>
      <div className='cell small-8'>
        <div className='flex-container'>
          <div className='flex-child-grow' />
          <div className='flex-child-auto'>
            <ToggleChangeSkin />
          </div>
          <div className='flex-child-grow' />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
	return {
  }
}

const mapDispatchToProps = dispatch => {
 	return {
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container