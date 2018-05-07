import React from 'react'
import { connect } from 'react-redux'

import { mkB } from 'components/button'

import { selectDatabase } from 'reducers/root-reducer'

import { save } from 'save'
import { tr } from 'dict'

const Presentational = props => {
  return mkB(()=>save('my.json', props.getJson()), tr('Export'))
}


const mapStateToProps = state => {
  let database = selectDatabase(state)
  return {
    getJson: () => database.toJson()
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
