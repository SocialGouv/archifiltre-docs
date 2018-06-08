import React from 'react'
import { connect } from 'react-redux'

import { mkTB } from 'components/button'

import TextAlignCenter from 'components/text-align-center'

import { toggleChangeSkin } from 'reducers/icicle-state'

import { selectIcicleState } from 'reducers/root-reducer'

import * as Color from 'color'

import { tr } from 'dict'

const Presentational = props => {

  
  let button_style = {
    margin: 0,
    padding: '0.3em 10%',
    fontSize: '1em',
    fontWeight: 'bold',
    borderRadius: '0.4em'
  }

  return (
    <div className='grid-x align-middle' style={{minWidth: '25em'}}>
      <div className='cell small-4'>
        <TextAlignCenter>{tr('View mode:')}</TextAlignCenter>
      </div>
      <div className='cell small-3'>
        <TextAlignCenter>{mkTB(props.toggleChangeSkin, tr('Volume'), props.change_skin, Color.parentFolder(), button_style)}</TextAlignCenter>
      </div>
      <div className='cell small-3'>
        <TextAlignCenter>{mkTB(props.toggleChangeSkin, tr('Dates'), !props.change_skin, Color.parentFolder(), button_style)}</TextAlignCenter>
      </div>
    </div>
  )
}



const mapStateToProps = state => {
  const icicle_state = selectIcicleState(state)

  return {
    change_skin: icicle_state.changeSkin(),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleChangeSkin: () => dispatch(toggleChangeSkin())
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
