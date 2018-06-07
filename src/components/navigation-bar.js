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

const component_style ={
  background: 'white',
  borderRadius: '5em',
  minHeight: '4em',
  maxHeight:'4em'
}

const Presentational = props => {

  return (
    <div style={component_style} className="cell small-4">
      <div className='grid-x grid-padding-x'>
        <div className='cell auto' />
        <div className='cell small-2'>
          <BTRButton />
        </div>
        <div className='cell small-6'>
          <ToggleChangeSkin />
        </div>
        <div className='cell auto' />
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